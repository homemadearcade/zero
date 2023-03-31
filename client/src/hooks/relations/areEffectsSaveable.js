import { useEffect, useState } from "react"
import { effectBehaviorInterface, effectBehaviorInterfaces } from "../../game/constants"

 export default function useAreEffectsSaveable(effects) {
  const [isSaveable, setIsSaveable] = useState();

  useEffect(() => {
    function isSaveDisabled(effect) {
      if(!effect) return
      
      const effectForms = effectBehaviorInterfaces[effect.effectBehavior]

      if(effectForms?.entityModelId) {
        if(!effect.entityModelId) return true
      }

      if(effectForms?.zoneEntityModelId) {
        if(!effect.zoneEntityModelId) return true
      }

      if(effectForms?.spawnEntityModelId) {
        if(!effect.spawnEntityModelId) return true
      }

      if(effectForms?.cutsceneId) {
        if(!effect.cutsceneId) return true
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

    if(!effects) return 

    setIsSaveable(!Object.keys(effects).every((effectId) => {
      return isSaveDisabled(effects[effectId])
    }))
  }, [effects])

  return isSaveable
} 
