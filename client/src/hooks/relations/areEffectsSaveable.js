import { useEffect, useState } from "react"
import {  effectInterfaceData } from "../../game/constants"

 export default function useAreEffectsSaveable(effects) {
  const [isSaveable, setIsSaveable] = useState();

  useEffect(() => {
    function isSaveDisabled(effect) {
      if(!effect) return
      
      const effectTypeInterfaceData = effectInterfaceData[effect.effectBehavior]

      if(effectTypeInterfaceData?.entityModelId) {
        if(!effect.entityModelId) return true
      }

      if(effectTypeInterfaceData?.zoneEntityModelId) {
        if(!effect.zoneEntityModelId) return true
      }

      if(effectTypeInterfaceData?.spawnEntityModelId) {
        if(!effect.spawnEntityModelId) return true
      }

      if(effectTypeInterfaceData?.cutsceneId) {
        if(!effect.cutsceneId) return true
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

    if(!effects) return 

    setIsSaveable(!Object.keys(effects).every((effectId) => {
      return isSaveDisabled(effects[effectId])
    }))
  }, [effects])

  return isSaveable
} 
