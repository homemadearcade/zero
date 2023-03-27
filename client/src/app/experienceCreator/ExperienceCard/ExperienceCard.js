import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '../../../ui/Typography/Typography';

import './ExperienceCard.scss';
import { CardActions } from '@mui/material';
import Link from '../../../ui/Link/Link';
import { editExperience, getExperiences } from '../../../store/actions/experienceActions';
import Button from '../../../ui/Button/Button';
import { ADMIN_ROLE } from '../../../constants';

const ExperienceCard = ({experience, experience: { metadata }, width, canEdit, canRemove, canPublish, editExperience, getExperiences, auth: { me }}) => {
  const isEditor = me?.role === ADMIN_ROLE || me?.id === experience.owner?.id

  function renderPublishButton() {
    if(experience.metadata.isPublished) {
      return <Button size="small" onClick={async () => {
        await editExperience(experience.id, {
          metadata: {
            isPublished: false
          }
        })
        getExperiences()
      }}>
        Unpublish
      </Button>
    } else {
      return <Button size="small" onClick={async () => {
        await editExperience(experience.id, {
          metadata: {
            isPublished: true
          }
        })
        getExperiences()
      }}>
        Publish
      </Button>
    }
  }

  function renderRemoveButton() {
    if(experience.isRemoved) {
      return <Button size="small" onClick={async () => {
        await editExperience(experience.id, {
          isRemoved: false
        })
        getExperiences()
      }}>
        Restore
      </Button>
    } else {
      return <Button size="small" onClick={async () => {
        await editExperience(experience.id, {
          isRemoved: true
        })
        getExperiences()
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
        {'by ' + (metadata.author ? metadata.author : experience.owner?.username)}
      </Typography>
      <Typography variant="body2" color="text.secondary">
          {metadata.description}
      </Typography>
    </CardContent>
    <CardActions>
      {canEdit && isEditor && < Link to={`/experience/${experience.id}`}>
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
  connect(mapStateToProps, { editExperience, getExperiences }))(ExperienceCard);
