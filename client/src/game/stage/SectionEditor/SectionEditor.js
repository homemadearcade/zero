import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import Button from '../../../ui/Button/Button';
import { closeSectionEditor } from '../../../store/actions/gameViewEditorActions';
import { editGameModel } from '../../../store/actions/gameModelActions';
import { FormLabel } from '@mui/material';

import './SectionEditor.scss'

const SectionEditor = ({closeSectionEditor, editGameModel, gameModel: { gameModel : { stages }}}) => {
  const boundaries = stages['default'].boundaries
  const [sections, setSections] = useState({})
  const [isError, setIsError] = useState(false)

  function verifySections() {
    const useableIds =  Object.keys(sections).filter((id) => {
      if(!sections[id]) return false
      return true
    }).map(Number).sort()

    const validSections = [
      [1],
      [2],
      [3],
      [4],
      [5],
      [6],
      [7],
      [8],
      [9],
      [1,2],
      [2,3],
      [4,5],
      [5,6],
      [7,8],
      [8,9],
      [1,4],
      [4,7],
      [2,5],
      [5,8],
      [3,6],
      [6,9],
      [1,2,3],
      [4,5,6],
      [7,8,9],
      [1,4,7],
      [2,5,8],
      [3,6,9],
      [1,2,4,5],
      [2,3,5,6],
      [4,5,7,8],
      [5,6,8,9],
      [1,2,
      4,5,
      7,8],
      [2,3,
      5,6,
      8,9],
      [1,2,3,4,5,6],
      [4,5,6,7,8,9],
      [1,2,3,4,5,6,7,8,9]
    ]

    return validSections.some((array) => {
      return _.isEqual(useableIds, array)
    })
  }

  function isAdjecent(newSectionId) {
    const useableIds =  Object.keys(sections).filter((id) => {
      if(!sections[id]) return false
      return true
    })

    if(!useableIds.length) return true

    return useableIds.some((id) => {
      if(!sections[id]) return false
      if(id == newSectionId - 1) return true
      if(id == newSectionId + 1) return true
      if(id == newSectionId - 3) return true
      if(id == newSectionId + 3) return true
      return false
    })
  }

  function handleAddSection(newSectionId) {
    // console.log(newSectionId, !isAdjecent(newSectionId), sections)

    if(!isAdjecent(newSectionId)) return

    setSections({
      ...sections,
      [newSectionId]: true
    })
  }


  useEffect(() => {
    const sectionsWidth = Math.floor((boundaries.width/boundaries.maxWidth) * 3)
    const sectionsHeight = Math.floor((boundaries.height/boundaries.maxHeight) * 3)
    const sectionsX = Math.floor((boundaries.x/boundaries.maxHeight) * 3)
    const sectionsY = Math.floor((boundaries.y/boundaries.maxHeight) * 3)
    
    const start = (sectionsY  * 3) + (sectionsX + 1)
    const sections = {}
    
    // console.log('start')
    for(let x = 0; x < sectionsWidth; x++) {
      // console.log('pushingin', start + x)
      sections[start + x] = true
    }
  
    // console.log('sections', sections)
  
    Object.keys(sections).map(Number).forEach((x) => {
      for(let y = 1; y < sectionsHeight; y++) {
        // console.log('adding for y', x + (3 * y))
        sections[x + (3 * y)] = true
      }
    })

    // console.log(sections, sectionsX, sectionsY, sectionsWidth, sectionsHeight)

    setSections(sections)
  }, [])

  return (
    <div className="SectionEditor">

      <BorderedGrid size="33vh" maxItems={9} items={[...Array(9)].map((_, i) => {
      if(sections[i+1]) {
        return <div className='SectionEditor__section' onClick={() => {
          setSections({
              ...sections,
              [i+1]: false
            })
        }}>

        </div>  
      } else {
        return <div className='SectionEditor__section SectionEditor__section--covered' onClick={() => {
          handleAddSection(i+1)
        }}>

        </div>  
      }
    })}>

    </BorderedGrid>
    <div className="SectionEditor__controls">
        <Button
          onClick={() => {
            if(!verifySections()) {
              setIsError(true)
              return
            }

            const sectionIds = Object.keys(sections).filter((id) => {
              return sections[id]
            })

            const min = _.min(sectionIds)
            const max = _.max(sectionIds)

            const xyCornerFromSectionId = {
              1: {
                x: 0,
                y: 0
              },
              2: {
                x: 360,
                y: 0
              },
              3: {
                x: 720,
                y: 0
              },
              4: {
                x: 0,
                y: 360
              },
              5: {
                x: 360,
                y: 360
              },
              6: {
                x: 720,
                y: 360
              },
              7: {
                x: 0,
                y: 720
              },
              8: {
                x: 360,
                y: 720
              },
              9: {
                x: 720,
                y: 720
              }
            }

            const {x, y} = xyCornerFromSectionId[min]

            const maxCorner = xyCornerFromSectionId[max]

            const width = (maxCorner.x - x) + 360
            const height = (maxCorner.y - y) + 360

            editGameModel({
              stages: {
                ['default']: {
                  boundaries: {
                    x,y,width,height
                  }
                }
              }
            })

            closeSectionEditor()
          }}
        >Save
        </Button>
        {isError && <FormLabel color="error"
        >Shape must be square<br/> or rectangular</FormLabel>}
        <Button
          onClick={() => {
            closeSectionEditor()
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
});

export default connect(mapStateToProps, { closeSectionEditor, editGameModel })(SectionEditor);