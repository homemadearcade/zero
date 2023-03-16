import { useEffect, useState } from "react"
import { effectEditInterface } from "../game/constants"

 export default function useAreEffectsSaveable(effects) {
  const [isSaveable, setIsSaveable] = useState();

  useEffect(() => {
    function isSaveDisabled(effect) {
      if(!effect) return
      
      const effectForms = effectEditInterface[effect.type]

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

      if(!effect.type) return true
      
      return false 
    }

    if(!effects) return 

    setIsSaveable(!Object.keys(effects).every((effectId) => {
      return isSaveDisabled(effects[effectId])
    }))
  }, [effects])

  console.log(isSaveable)

  return isSaveable
} 
