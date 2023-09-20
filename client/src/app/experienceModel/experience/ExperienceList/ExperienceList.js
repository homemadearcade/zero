import React, { useEffect, useState} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ExperienceList.scss';

import SearchIcon from '@mui/icons-material/Search';
import Loader from '../../../../ui/Loader/Loader';
import { getExperienceModels } from '../../../../store/actions/experience/experienceModelActions';
import ButtonGroup from '../../../../ui/ButtonGroup/ButtonGroup';
import Checkbox from '../../../../ui/Checkbox/Checkbox';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import Button from '../../../../ui/Button/Button';

const SORT_CREATED = 'SORT_CREATED'
const SORT_EDITED = 'SORT_EDITED'

const ExperienceList = ({ customFilter, getExperienceModels, children, experienceModel: { experienceModels, isLoading }}) => {
  useEffect(() => {
    getExperienceModels();
  }, [getExperienceModels]);

  const [searchTerm, setSearchTerm] = useState("")
  const [experienceList, setExperienceList] = useState(experienceModels)
  const [showRemoved, setShowRemoved] = useState(false)
  const [sortBy, setSortBy] = useState(SORT_CREATED)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)

  useEffect(() => {
    if(searchTerm) {
      setExperienceList(experienceModels.filter((experienceModel) => {
        if(experienceModel.metadata.title?.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        if(experienceModel.owner?.username.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        if(experienceModel.metadata.description?.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        if(experienceModel.metadata.authorPseudonym?.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        return false
      })).slice().sort(sortExperienceList)
    } else {
      setExperienceList(experienceModels.slice().sort(sortExperienceList))
    }
  }, [searchTerm, experienceModels, sortBy])

  function handleSearchChange(e) {
    setSearchTerm(e.target.value)
  }

  function sortExperienceList(experienceModelA, experienceModelB) {
    if(sortBy === SORT_CREATED) {
      return new Date(experienceModelB.createdAt).getTime() - new Date(experienceModelA.createdAt).getTime()
    } else if(sortBy === SORT_EDITED) {
      console.log(new Date(experienceModelB.updatedAt).getTime(), new Date(experienceModelA.updatedAt).getTime())
      return new Date(experienceModelB.updatedAt).getTime() - new Date(experienceModelA.updatedAt).getTime()
    }
  }

  function filterExperienceList(experienceModel) {
    if(showRemoved) {
      if((experienceModel.isRemoved && showRemoved)) return true
      return false
    }


    if((experienceModel.isRemoved)) return false

    return true
  }

  function renderExperienceList() {
    if(customFilter) {
      experienceList.filter(customFilter).filter(filterExperienceList).map(children)
    } else {
      return experienceList.filter(filterExperienceList).map(children)
    }
  }

  function renderToggles() {
    return <div className="ExperienceList__filter">
      Filter By:

      <div>
        <Checkbox size="small" checked={showRemoved} onChange={(checked) => {
          setShowRemoved(checked)
        }} label={"Removed"}></Checkbox>

      </div>
    </div>
  }

  function renderSortBy() {
    return <>
      <ButtonGroup value={sortBy} onSelectOption={(e) => {
        setSortBy(e.target.value)
      }} formLabel="Sort By:" options={[{icon: 'Created', value: SORT_CREATED}, {value: SORT_EDITED, icon: 'Last Edit'}]}>
      </ButtonGroup>
    </>
  }

  return (
    <div className="ExperienceList">
      <TextField sx={{width: '100%'}} 
        onChange={handleSearchChange} 
        value={searchTerm} 
        label={"Search Title, Author, Description"}
        InputProps={{
        endAdornment: (
          <InputAdornment>
            <IconButton>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
          )
        }}  
      />
      {showAdvancedSearch && renderSortBy()}
      {showAdvancedSearch && renderToggles()}
      {!customFilter && !showAdvancedSearch && <Button size="small" onClick={() => {
        setShowAdvancedSearch(true)
      }}>
        Advanced Search
      </Button>}
      {isLoading ? (
        <Loader />
      ) : <div className="ExperienceList__list">{renderExperienceList()}</div>}
    </div>
  )
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
  auth: state.auth,
});

export default compose(
  connect(mapStateToProps, { getExperienceModels })
)(ExperienceList);
