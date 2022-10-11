import { IMAGE_AND_TEXT_CUTSCENE } from "../constants";

export const defaultCutscene = {
  // pauseGame: true,
  name: null,
  scenes: [{
    type: IMAGE_AND_TEXT_CUTSCENE, 
    imageUrl: null,
    text: null 
  }]
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