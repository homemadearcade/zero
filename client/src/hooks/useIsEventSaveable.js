import { useEffect, useState } from "react"
import { eventTypeInterfaces, SINGLE_TAG_EVENT, TWO_TAG_EVENT } from "../game/constants";

 export default function useIsEventSaveable(event) {
  const [isSaveable, setIsSaveable] = useState();

  useEffect(() => {
  function isSaveDisabled() {
    if(!event ||!event.eventType) return true
    
    const eventTypeInterface = eventTypeInterfaces[event.eventType]

    if(eventTypeInterface.tagSelectType === SINGLE_TAG_EVENT) {
      if(!event.tagIdA) return true
    }

    if(eventTypeInterface.tagSelectType === TWO_TAG_EVENT) {
      if(!event.tagIdA || !event.tagIdB) return true
    }

    return false 
  }

  setIsSaveable(!isSaveDisabled())

  }, [event])

  return isSaveable
} 
