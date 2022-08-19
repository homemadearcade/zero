import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import BorderedGrid from '../../app/ui/BorderedGrid/BorderedGrid';
import Button from '../../app/ui/Button/Button';
import { closeSectionEditor } from '../../store/actions/editorActions';

import './SectionEditor.scss'

const SectionEditor = ({closeSectionEditor, game: { gameModel : { world: { boundaries }}}}) => {
  const [sections, setSections] = useState({})

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
      [9]
      [1,2],
      [2,3],
      [4,5],
      [5,6],
      [7,8],
      [8,9]
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
      [5,6,8,9]
      [1,2,
      4,5,
      7,8],
      [2,3,
      5,6,
      8,9],
      [1,2,3,4,5,6],
      [4,5,6,7,8,9]
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
  
    Object.keys(sections).forEach((x) => {
      for(let y = 1; y < sectionsHeight; y++) {
        // console.log('adding for y', x + (3 * y))
        sections[x + (3 * y)] = true
      }
    })

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
            const isVerified = verifySections()
            if(isVerified) {
              closeSectionEditor()
            }
          }}
        >Save
        </Button>
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
  game: state.game
});

export default connect(mapStateToProps, { closeSectionEditor })(SectionEditor);