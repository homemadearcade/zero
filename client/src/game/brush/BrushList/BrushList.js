/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './BrushList.scss';
import { editGameModel } from '../../../store/actions/gameModelActions';
import BrushItem from '../../brush/BrushItem/BrushItem';
import CreateBrushFlow from '../CreateBrushFlow/CreateBrushFlow';
import { openCreateBrushFlow } from '../../../store/actions/gameFormEditorActions';
import { BACKGROUND_CANVAS_ID, BRUSH_ID_PREFIX, FOREGROUND_CANVAS_ID, PLAYGROUND_CANVAS_ID } from '../../constants';
import Button from '../../../ui/Button/Button';
import Typography from '../../../ui/Typography/Typography';
import BrushControl from '../BrushControl/BrushControl';
import EraserSelect from '../../ui/EraserSelect/EraserSelect';
import LayerVisibility from '../../ui/LayerVisibility/LayerVisibility';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import LayerColorSelect from '../../color/LayerColorSelect/LayerColorSelect';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import CobrowsingAccordianList from '../../../game/cobrowsing/CobrowsingAccordianList/CobrowsingAccordianList';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { getInterfaceIdData } from '../../../utils/unlockableInterfaceUtils';
import { generateUniqueId } from '../../../utils/webPageUtils';

const BrushList = ({
  gameModel: { gameModel },
  gameFormEditor: { isCreateBrushFlowOpen },
  editGameModel,
  openCreateBrushFlow,
}) => {
  const brushes = gameModel?.brushes

  if(!brushes) {
    return null
  }

  const brushesByLayer = Object.keys(brushes).reduce((prev, brushId) => {
    const brush = brushes[brushId]
    if(!prev[brush.canvasId]) prev[brush.canvasId] = []
    prev[brush.canvasId].push({ brushId, brush })
    return prev
  }, {})

  const bgBrushes = brushesByLayer[BACKGROUND_CANVAS_ID]?.map(({brushId}, i) => {
    return <BrushItem key={i} brushId={brushId}/>
  }).slice(0, 14) || []
  
  bgBrushes.push(<Unlockable isTiny interfaceId={BACKGROUND_CANVAS_ID + '/addBrush'}>
    <Button size="fit" onClick={() => {
      openCreateBrushFlow(BACKGROUND_CANVAS_ID)
    }}>
    +
    </Button>
  </Unlockable>)

  const pgBrushes = brushesByLayer[PLAYGROUND_CANVAS_ID]?.map(({brushId}, i) => {
    return <BrushItem key={i} brushId={brushId}/>
  }).slice(0, 14) || []

  pgBrushes.push(<Unlockable isTiny interfaceId={PLAYGROUND_CANVAS_ID + '/addBrush'}>
    <Button size="fit" onClick={() => {
      openCreateBrushFlow(PLAYGROUND_CANVAS_ID)
    }}>
      +
    </Button>
  </Unlockable>)

  const fgBrushes = brushesByLayer[FOREGROUND_CANVAS_ID]?.map(({brushId}, i) => {
    return <BrushItem key={i} brushId={brushId}/>
  }).slice(0, 14) || []

  fgBrushes.push(<Unlockable isTiny interfaceId={FOREGROUND_CANVAS_ID + '/addBrush'}>
    <Button size="fit" onClick={() => {
      openCreateBrushFlow(FOREGROUND_CANVAS_ID)
    }}>
      +
    </Button>
  </Unlockable>)

  const accordians = []

  if(!getInterfaceIdData(BACKGROUND_CANVAS_ID + '/*').isObscured) {
    accordians.push({
      id: 'Background',
      title: <>
        <Typography component="div" variant="subtitle1">Background</Typography>
        <LayerVisibility canvasId={BACKGROUND_CANVAS_ID} />
      </>,
      body: <>
        <EraserSelect canvasId={BACKGROUND_CANVAS_ID}/>
        <LayerColorSelect canvasId={BACKGROUND_CANVAS_ID}/>
        <Unlockable interfaceId={BACKGROUND_CANVAS_ID + "/brushSelect"}>
          <div className="BrushList__brushes">
            <BorderedGrid 
            maxItems={15} 
            size="3.5vh"
            items={bgBrushes}/>
          </div>
        </Unlockable>
      </>
    })
  }

  if(!getInterfaceIdData(PLAYGROUND_CANVAS_ID + '/*').isObscured) {
    accordians.push({
      id: 'Playground',
      title: <>
        <Typography component="div" variant="subtitle1">Playground</Typography>
        <LayerVisibility canvasId={PLAYGROUND_CANVAS_ID} />
      </>,
      body: <>
        <EraserSelect canvasId={PLAYGROUND_CANVAS_ID}/>
        <LayerColorSelect canvasId={PLAYGROUND_CANVAS_ID}/>
        <Unlockable interfaceId={PLAYGROUND_CANVAS_ID + "/brushSelect"}>
          <div className="BrushList__brushes">
            <BorderedGrid 
              maxItems={15} 
              size="3.5vh"
              items={pgBrushes}/>
          </div>
        </Unlockable>
      </>
    })
  }
  if(!getInterfaceIdData(FOREGROUND_CANVAS_ID + '/*').isObscured) {
    accordians.push({
      id: 'Foreground',
      title: <>
        <Typography component="div" variant="subtitle1">Foreground</Typography>
        <LayerVisibility canvasId={FOREGROUND_CANVAS_ID} />
      </>,
      body: <>
        <EraserSelect canvasId={FOREGROUND_CANVAS_ID}/>
        <LayerColorSelect canvasId={FOREGROUND_CANVAS_ID}/>
          <Unlockable interfaceId={FOREGROUND_CANVAS_ID + "/brushSelect"}>
            <div className="BrushList__brushes">
              <BorderedGrid 
              maxItems={15} 
              size="3.5vh"
              items={fgBrushes}/>
            </div>
        </Unlockable>
      </>
    })
  }

  return <div className="BrushList">
    <BrushControl/>
    <CobrowsingAccordianList
      listId="BrushList"
      accordians={accordians}
    />
    {isCreateBrushFlowOpen && <CreateBrushFlow 
      onComplete={(brush) => {
        if(!brush.textureId) {   
          if(brush.tint) {
            editGameModel({
              colors: {
                [brush.tint]: {
                  [brush.canvasId]: true
                }
              }
            })
          }
        } else {
          const brushId = BRUSH_ID_PREFIX+generateUniqueId()
          editGameModel({
            brushes: {
              [brushId] : brush
            }
          })
        }

    }}/>
  }
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor,
})


export default compose(
  connect(mapStateToProps, { editGameModel, openCreateBrushFlow }),
)(BrushList);
