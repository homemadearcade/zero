import { useEffect, useState } from "react"
import { effectEditInterfaces } from "../../game/constants"

 export default function useIsEffectSaveable(effect) {
  const [isSaveable, setIsSaveable] = useState();

  useEffect(() => {
    function isSaveDisabled() {
      if(!effect || !effect.effectBehavior) return false

      const effectForms = effectEditInterfaces[effect.effectBehavior]

      if(effectForms?.entityModelId) {
        if(!effect.entityModelId) return true
      }

      if(effectForms?.zoneEntityModelId) {
        if(!effect.zoneEntityModelId) return true
      }

      if(effectForms?.cutsceneId) {
        if(!effect.cutsceneId) return true
      }

      if(effectForms?.spawnEntityModelId) {
        if(!effect.spawnEntityModelId) return true
      }


      if(effectForms?.stageId) {
        if(!effect.stageId) return true
      }

      if(effectForms?.text) {
        if(!effect.text) return true
      }

      if(!effect.effectBehavior) return true
      
      return false 
    }

    setIsSaveable(!isSaveDisabled())
  }, [effect])

  return isSaveable
} 
