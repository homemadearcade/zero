export function getServiceFee(price) {
  return price * .03
} 

export function getTotalWithFee(price) {
  return price + getServiceFee(price)
} 

export function isDateSoldOut({dateId: relevantDateId, ticketPurchases, ticketedEvent}) {
  const relevantPurchases = ticketPurchases.filter(({dateId}) => {
    return relevantDateId === dateId
  })

  const totalTix = ticketedEvent.tickets.reduce((prev, next) => {
    return prev + next.quantity
  }, 0)

  return totalTix - relevantPurchases.length <= 0 
}

export function getTicketPurchaseInfo({ticketedEvent, ticketPurchase}) {
   const startTime = ticketedEvent.dates.find((date) => {
    return date.dateId === ticketPurchase.dateId
  }).startTime

  const ticket = ticketedEvent.tickets.find((ticket) => {
    return ticket.ticketId === ticketPurchase.ticketId
  })
  
  return {
    startTime,
    name: ticket.name,
    price: ticket.price
  }
}

export function getTicketData({ticketedEvent, ticketPurchases, ticketId, dateId, quantity}) {
  const isSoldOut = isTicketSoldOut({ticketId, dateId, ticketPurchases, ticketedEvent})
  const unsold = getUnsoldTickets({ticketId, dateId, ticketPurchases, ticketedEvent})
  const isAtMax= isTicketAtMaximum({quantity, ticketId, dateId, ticketPurchases, ticketedEvent})

  return {
    isSoldOut,
    isAtMax,
    unsold,
    remaining: unsold - quantity
  }
}

export function isTicketSoldOut({ticketedEvent, ticketPurchases, ticketId, dateId}) {
  return getUnsoldTickets({ticketedEvent, ticketPurchases, ticketId, dateId}) <= 0
}

export function isTicketAtMaximum({quantity, ticketedEvent, ticketPurchases, ticketId, dateId}) {

  const remaining = getUnsoldTickets({ticketedEvent, ticketPurchases, ticketId, dateId})

  return remaining - quantity <= 0
}

export function getUnsoldTickets({ticketedEvent, ticketPurchases, ticketId: relevantTicketId, dateId: relevantDateId}) {

  const ticketType = ticketedEvent.tickets.find((ticket) => ticket.ticketId === relevantTicketId)
  const quantity = ticketType.quantity

  const relevantPurchases = ticketPurchases.filter(({dateId, ticketId}) => {
    return relevantDateId === dateId && ticketId === relevantTicketId
  })

  return quantity - relevantPurchases.length
}