import { useEffect, useState } from "react"
import { eventEditInterface, SINGLE_TAG_EVENT, TWO_TAG_EVENT } from "../game/constants";

 export default function useIsEventSaveable(event) {
  const [isSaveable, setIsSaveable] = useState();

  useEffect(() => {
  function isSaveDisabled() {
    if(!event ||!event.type) return true
    
    const eventInterface = eventEditInterface[event.type]

    if(eventInterface.tagSelectType === SINGLE_TAG_EVENT) {
      if(!event.tagId) return true
    }

    if(eventInterface.tagSelectType === TWO_TAG_EVENT) {
      if(!event.tagIdA || !event.tagIdB) return true
    }

    return false 
  }

  setIsSaveable(!isSaveDisabled())

  }, [event])

  return isSaveable
} 
