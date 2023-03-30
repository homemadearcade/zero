import { useEffect, useState } from "react"
import { effectBehaviorInterface, effectBehaviorInterfaces } from "../game/constants"

 export default function useAreEffectsSaveable(effects) {
  const [isSaveable, setIsSaveable] = useState();

  useEffect(() => {
    function isSaveDisabled(effect) {
      if(!effect) return
      
      const effectForms = effectBehaviorInterfaces[effect.effectBehavior]

      if(effectForms?.entityClassId) {
        if(!effect.entityClassId) return true
      }

      if(effectForms?.zoneEntityClassId) {
        if(!effect.zoneEntityClassId) return true
      }

      if(effectForms?.spawnEntityClassId) {
        if(!effect.spawnEntityClassId) return true
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
