import { useEffect, useState } from "react"
import { SINGLE_RELATION_TAG_EVENT_IID, TWO_RELATION_TAG_EVENT_IID } from "../../constants/interfaceIds";
import { eventTypeInterfaces } from "../../game/constants";

 export default function useIsEventSaveable(event) {
  const [isSaveable, setIsSaveable] = useState();

  useEffect(() => {
  function isSaveDisabled() {
    if(!event ||!event.eventType) return true
    
    const eventTypeInterface = eventTypeInterfaces[event.eventType]

    if(eventTypeInterface.relationTagSelectType === SINGLE_RELATION_TAG_EVENT_IID) {
      if(!event.relationTagIdA) return true
    }

    if(eventTypeInterface.relationTagSelectType === TWO_RELATION_TAG_EVENT_IID) {
      if(!event.relationTagIdA || !event.relationTagIdB) return true
    }

    return false 
  }

  setIsSaveable(!isSaveDisabled())

  }, [event])

  return isSaveable
} 
