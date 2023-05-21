import { IMAGE_AND_TEXT_SCENE_IID } from "../../../constants/interfaceIds";

export const defaultCutscene = {
  // pauseGame: true,
  name: null,
  cutsceneId: null,
  scenes: [],
}

export const defaultScene = {
  id: null,
  entityModelId: null,
  sceneInterfaceType: IMAGE_AND_TEXT_SCENE_IID, 
  imageUrl: null,
  text: null 
}

// 'cutscene1': {
//   pauseGame: true,
//   scenes: [
//     {
//       // imageUrl: 'https://i.imgur.com/6icjnbZ.jpeg',
//       text: 'This is the first scene text'
//     },
//     {
//       // imageUrl: 'https://i.imgur.com/6icjnbZ.jpeg',
//       text: 'This is the first scene text 2. This is the first scene text 2. This is the first scene text 2. This is the first scene text 2'
//     },
//     {
//       // imageUrl: 'https://i.imgur.com/6icjnbZ.jpeg',
//       text: 'This is the first scene text 3'
//     }
//   ]
// }