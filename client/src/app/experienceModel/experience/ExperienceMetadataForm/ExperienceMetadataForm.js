import React from 'react';
import { connect } from 'react-redux';

import './ExperienceMetadataForm.scss';
import { TextField } from '@mui/material';
import { editExperienceModel } from '../../../../store/actions/experience/experienceModelActions';
import { Controller, useForm } from 'react-hook-form';
import Button from '../../../../ui/Button/Button';
// import MyImagesModal from '../../textures/MyImagesModal/MyImagesModal';

      // {isMyImagesModalOpen && <MyImagesModal onClickTexture={(textureId) => {
      //   setImageUrl(getImageUrlFromTextureId(textureId))
      //   setIsMyImagesModalOpen(false)
      // }}/>}

const ExperienceMetadataForm = ({ editExperienceModel, experienceModel: { experienceModel, isSaving }, onSubmit}) => {
  const metadata = experienceModel.metadata

  const { title, description, authorPseudonym } = metadata

  // const [isMyImagesModalOpen, setIsMyImagesModalOpen] = useState(metadata.imageUrl)

  // const [imageUrl, setImageUrl] = useState(metadata.imageUrl)

  const { handleSubmit, control } = useForm({
    defaultValues: {
      title,
      description,
      authorPseudonym : authorPseudonym ? authorPseudonym : experienceModel.owner?.username,
      // imageUrl
    },
  });

  const submit = async (data) => {
    editExperienceModel(experienceModel.id, {
      metadata: {
        ...data,
        // imageUrl
      },
    })
    // reset();
    if(onSubmit) onSubmit()
  }

  // function renderImageSelect() {
  //   return <>
  //     {imageUrl  && <img className="ExperienceMetadataForm__image" alt={title + ' image'} src={imageUrl}/>}
  //     <Button onClick={() => {
  //       setIsMyImagesModalOpen(true)
  //     }}>Select Image</Button>
  //   </>
  // }

  return (
    <div className="GameMetadataForm">
      <form>
        {/* {renderImageSelect()} */}
        <div>
          <Controller
            name={"title"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField onChange={onChange} value={value} label={"Title"} />
            )}
          />
        </div>
        <div>
          <Controller
            name={"authorPseudonym"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField onChange={onChange} value={value} label={"Author"} />
            )}
          />
        </div>
        <div>
          <Controller
            name={"description"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField multiline onChange={onChange} value={value} label={"Description"} />
            )}
          />
        </div>
        <Button type="submit" disabled={isSaving} onClick={handleSubmit(submit)}>Save</Button>
      </form>

    </div>
  )
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { editExperienceModel })(ExperienceMetadataForm);
