import * as React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@mui/material/SvgIcon';
import { alpha, styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Collapse from '@mui/material/Collapse';
// web.cjs is required for IE11 support
import { useSpring, animated } from '@react-spring/web';
import allInterfaceIds from './allInterfaceIds.json'

import './UnlockableInterfaceTree.scss'
import { areIdAliasesUnlocked, getInterfaceIdAliases } from '../../utils/unlockableInterfaceUtils';
import MenuIconButton from '../MenuIconButton/MenuIconButton';
import Icon from '../Icon/Icon';
import { MenuItem } from '@mui/material';
import { connect } from 'react-redux';
import { updateArcadeGameCharacter } from '../../store/actions/arcadeGameActions';
import { getUserById } from '../../store/actions/userActions';
import Button from '../Button/Button';
import { cloneDeep } from 'lodash';
import Loader from '../Loader/Loader';

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function TransitionComponent(props) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: 'translate3d(20px,0,0)',
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
};

const StyledTreeItem = styled((props) => {
  return (
    <TreeItem classes={{
      content: props.contentClass,
    }} {...props} TransitionComponent={TransitionComponent} />
  )})(({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
      '& .close': {
        opacity: 0.3,
      },
    },
    [`& .${treeItemClasses.group}`]: {
      marginLeft: 15,
      paddingLeft: 18,
      borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
  }));


    // {
    //   id: '3',
    //   name: 'Child - 3',
    //   children: [
    //     {
    //       id: '4',
    //       name: 'Child - 4',
    //     },
    //   ],
    // },

window.allInterfaceIds = allInterfaceIds
const nodeIdsWithChildren = []

function structureAllInterfaceIds() {
  const interfaceIdRoot= {
    "id": "all",
    "name": "all",
    "children": []
  }

  const previouslySeen = {
    'all': true
  }
  window.allInterfaceIds = window.allInterfaceIds.filter((id) => {
    if(previouslySeen[id]) return false
    previouslySeen[id] = true
    return true
  })

  window.allInterfaceIds.forEach((id) => {
    const idAliases = getInterfaceIdAliases(id)

    idAliases.forEach((aliasSet) => {
      let currentTreeNode = interfaceIdRoot

      aliasSet.forEach((nodeNameRaw, index) => {
        let nodeName = nodeNameRaw.split('/')
        nodeName = nodeName[nodeName.length - 1]

        let foundNode = null
        currentTreeNode.children.forEach((node) => {
          if(node.name === nodeName) {
            foundNode = node
          }
        })

        if(foundNode) {
          currentTreeNode = foundNode
        } else {
          const newTreeNode = {
            id: nodeNameRaw,
            name: nodeName,
            children: []
          }
          currentTreeNode.children.push(newTreeNode)
          currentTreeNode = newTreeNode
          // console.log(cloneDeep(interfaceIdRoot))
        }
      })
    })
  })

  return interfaceIdRoot
}


function getClassName(id, unlockableInterfaceIds) {
  if(unlockableInterfaceIds[id]) return 'TreeItem__unlocked--specific'

  const idAliases = getInterfaceIdAliases(id)
  const isUnlocked = areIdAliasesUnlocked(idAliases, unlockableInterfaceIds)

  if(isUnlocked) return 'TreeItem__unlocked'
}

function UnlockableInterfaceTree({ userId, getUserById, user: { user }, updateArcadeGameCharacter}) {

  const [expanded, setExpanded] = React.useState([]);
  const [structuredInterfaceData] = React.useState(structureAllInterfaceIds())

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? nodeIdsWithChildren : [],
    );
  };

  React.useEffect(() => {
    if(user?.id !== userId) {
      getUserById(userId)
    }
    
  }, [userId, user?.id])

  console.log(user, userId)

  if(!user) return <Loader text="Loading User..."></Loader>

  function ToggleLockMenu({interfaceId, unlockableInterfaceIds}) {

    const idAliases = getInterfaceIdAliases(interfaceId)
    const isUnlocked = areIdAliasesUnlocked(idAliases, unlockableInterfaceIds)

    function mapIdsToMenuItems(closeMenu) {
      const list = []

      if(!isUnlocked) {
        idAliases.forEach(alias => alias.slice().reverse().forEach((id) => {
          list.push(<MenuItem key={id + alias} onClick={async () => {
            await updateArcadeGameCharacter({
              userId: userId,
              unlockableInterfaceIds : {
                ...unlockableInterfaceIds,
                [id]: true
              }
            })
            await getUserById(userId)
            closeMenu()
          }}>Unlock {id}</MenuItem>)
        }))
      } else {
        idAliases.forEach(alias => alias.forEach((id) => {
          if(unlockableInterfaceIds[id]) {
            list.push(<MenuItem key={id + alias} onClick={async () => {
              await updateArcadeGameCharacter({
                userId: userId,
                unlockableInterfaceIds : {
                  ...unlockableInterfaceIds,
                  [id]: false
                }
              })
              await getUserById(userId)
              closeMenu()
            }}>Lock {id}</MenuItem>)
          }
        }))
      }

      return list
    }

    return <div className={'Unlockable__menu--tiny'}>
      <MenuIconButton
        icon={<Icon size="xs" icon={isUnlocked ? "faLockOpen" : "faLock"} />} 
        menu={mapIdsToMenuItems}
      />
    </div>
  }

  const renderTree = (nodes) => {
    if(nodes.children.length) nodeIdsWithChildren.push(nodes.id)
    return (
      <>
        <StyledTreeItem contentClass={getClassName(nodes.id, user.unlockableInterfaceIds) + ' TreeItem'} key={nodes.id} nodeId={nodes.id} label={nodes.name}>
          <ToggleLockMenu interfaceId={nodes.id} unlockableInterfaceIds={user.unlockableInterfaceIds}></ToggleLockMenu>
          {Array.isArray(nodes.children)
            ? nodes.children.map((node) => renderTree(node))
            : null}
          
        </StyledTreeItem>
      </>
    )
  }

  return (
    <>
      <Button onClick={handleExpandClick}>
        {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
      </Button>
      <TreeView
        aria-label="customized"
        defaultExpanded={['10']}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<CloseSquare />}
        expanded={expanded}
        onNodeToggle={handleToggle}
        sx={{ flexGrow: 1, overflowY: 'auto' }}
      >
        {renderTree(structuredInterfaceData)}
      </TreeView>
    </>
  );
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps, { getUserById, updateArcadeGameCharacter })(UnlockableInterfaceTree);
