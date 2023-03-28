import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '../../../../ui/Typography/Typography';

import './ExperienceCard.scss';
import { CardActions } from '@mui/material';
import Link from '../../../../ui/Link/Link';
import { editExperienceModel, getExperienceModels } from '../../../../store/actions/experienceModelActions';
import Button from '../../../../ui/Button/Button';
import { ADMIN_ROLE } from '../../../../constants';

const ExperienceCard = ({experienceModel, experienceModel: { metadata }, width, canEdit, canRemove, canPublish, editExperienceModel, getExperienceModels, auth: { me }}) => {
  const isEditor = me?.role === ADMIN_ROLE || me?.id === experienceModel.owner?.id

  function renderPublishButton() {
    if(experienceModel.metadata.isPublished) {
      return <Button size="small" onClick={async () => {
        await editExperienceModel(experienceModel.id, {
          metadata: {
            isPublished: false
          }
        })
        getExperienceModels()
      }}>
        Unpublish
      </Button>
    } else {
      return <Button size="small" onClick={async () => {
        await editExperienceModel(experienceModel.id, {
          metadata: {
            isPublished: true
          }
        })
        getExperienceModels()
      }}>
        Publish
      </Button>
    }
  }

  function renderRemoveButton() {
    if(experienceModel.isRemoved) {
      return <Button size="small" onClick={async () => {
        await editExperienceModel(experienceModel.id, {
          isRemoved: false
        })
        getExperienceModels()
      }}>
        Restore
      </Button>
    } else {
      return <Button size="small" onClick={async () => {
        await editExperienceModel(experienceModel.id, {
          isRemoved: true
        })
        getExperienceModels()
      }}>
        Remove
      </Button>
    }
  }

 return <Card className="ExperienceCard" sx={{ width: width? width : 200 }}>
    <CardMedia
      component="img"
      image={metadata.imageUrl ? metadata.imageUrl : ""}
      alt={metadata.title}
    />
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {metadata.title}
      </Typography>
      <Typography gutterBottom variant="subtitle2" component="div">
        {'by ' + (metadata.author ? metadata.author : experienceModel.owner?.username)}
      </Typography>
      <Typography variant="body2" color="text.secondary">
          {metadata.description}
      </Typography>
    </CardContent>
    <CardActions>
      {canEdit && isEditor && < Link to={`/experience/${experienceModel.id}`}>
        Edit
      </Link>}
      {canPublish && isEditor && renderPublishButton()}
      {canRemove && isEditor && renderRemoveButton()}
    </CardActions>
  </Card>
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default compose(
  connect(mapStateToProps, { editExperienceModel, getExperienceModels }))(ExperienceCard);
