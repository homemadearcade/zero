import { useEffect, useState } from "react"
import { effectInterfaceData } from "../../game/constants"

 export default function useIsEffectSaveable(effect) {
  const [isSaveable, setIsSaveable] = useState();

  useEffect(() => {
    function isSaveDisabled() {
      if(!effect || !effect.effectBehavior) return false

      const effectTypeInterfaceData = effectInterfaceData[effect.effectBehavior]

      if(effectTypeInterfaceData?.entityModelId) {
        if(!effect.entityModelId) return true
      }

      if(effectTypeInterfaceData?.zoneEntityModelId) {
        if(!effect.zoneEntityModelId) return true
      }

      if(effectTypeInterfaceData?.cutsceneId) {
        if(!effect.cutsceneId) return true
      }

      if(effectTypeInterfaceData?.spawnEntityModelId) {
        if(!effect.spawnEntityModelId) return true
      }


      if(effectTypeInterfaceData?.stageId) {
        if(!effect.stageId) return true
      }

      if(effectTypeInterfaceData?.text) {
        if(!effect.text) return true
      }

      if(!effect.effectBehavior) return true
      
      return false 
    }

    setIsSaveable(!isSaveDisabled())
  }, [effect])

  return isSaveable
} 
