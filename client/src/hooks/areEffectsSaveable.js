import { useEffect, useState } from "react"
import { effectBehaviorInterface } from "../game/constants"

 export default function useAreEffectsSaveable(effects) {
  const [isSaveable, setIsSaveable] = useState();

  useEffect(() => {
    function isSaveDisabled(effect) {
      if(!effect) return
      
      const effectForms = effectBehaviorInterface[effect.effectBehavior]

      if(effectForms?.classId) {
        if(!effect.classId) return true
      }

      if(effectForms?.zoneClassId) {
        if(!effect.zoneClassId) return true
      }

      if(effectForms?.spawnClassId) {
        if(!effect.spawnClassId) return true
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
