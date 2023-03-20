import * as React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAutocomplete } from '@mui/base/AutocompleteUnstyled';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import FormLabel from '../FormLabel/FormLabel';
import Sprite from '../../game/images/Texture/Texture';
import { lighten, darken } from '@mui/system';
import Typography from '../Typography/Typography';

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

const GroupContainer = styled('ul')({
  padding: 0,
});

/* eslint-disable react/prop-types */
const Root = styled('div')(
  ({ theme }) => `
  color: ${
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,.85)'
  };
  font-size: 1rem;
  position: relative;
`,
);

const InputWrapper = styled('div')(
  ({ theme }) => `
  width: calc(100% -2px);
  border: 1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.23)' : '#d9d9d9'};
  background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: ${theme.palette.mode === 'dark' ? theme.palette.primary.main : '#40a9ff'};
  }

  &.focused {
    border-color: ${theme.palette.mode === 'dark' ? theme.palette.primary.main : '#40a9ff'};
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
    color: ${
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,.85)'
    };
    min-height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`,
);

function Tag(props) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const StyledTag = styled(Tag)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  min-height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: ${
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#fafafa'
  };
  border: 1px solid ${theme.palette.mode === 'dark' ? '#303030' : '#e8e8e8'};
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }

  .Texture {
    margin-right: 0px;
  }
`,
);

const SpriteWrapper = styled('div')(
  ({ theme }) => `
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 10px;
  `
)

const Listbox = styled('ul')(
  ({ theme }) => `
  width: 100%;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
  overflow: auto;
  max-height: 250px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 2;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    .Texture {
      width: 20px;
      height: 20px;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === 'dark' ? '#2b2b2b' : '#fafafa'};
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`,
);

export default function SelectChipsAuto({
  onChange,
  groupBy,
  value,
  hideRemoved,
  options,
  disabled,
  formLabel,
  freeSolo
}) {
  const [inheritedValue, setInheritedValue] = useState([])

  function onValueChanged(value) {
    setInheritedValue(value.map((val) => {
      const filtered = options.filter((option) => {
        if(option.value === val) return option
        else return null
      })

      if(freeSolo) {
        if(!filtered[0] && val) return { label: val, value: val }
      }

      return filtered[0]
    }))
  }

  useEffect(() => {
    if(value !== inheritedValue) {
      onValueChanged(value)
    }
  }, [value])

  if(inheritedValue === undefined) return null

  return <SelectChipsAutoForm 
    hideRemoved={hideRemoved} 
    groupBy={groupBy} 
    freeSolo={freeSolo} 
    onChange={onChange} 
    disabled={disabled} 
    inheritedValue={inheritedValue} 
    options={options.filter(({label}) => {
      return !!label
    })} 
    formLabel={formLabel}
  />
}

function SelectChipsAutoForm({
  onChange,
  groupBy,
  hideRemoved,
  inheritedValue,
  disabled,
  options,
  formLabel,
  freeSolo
}) {
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
    setAnchorEl,
  } = useAutocomplete({ 
    id: formLabel,
    value: inheritedValue,
    multiple: true,
    options,
    freeSolo,
    includeInputInList: freeSolo,
    groupBy,
    // disabled: !!disabled,
    // disableClearable: !!disabled,
    // disableListWrap: !!disabled,
    // disabledItemsFocusable: !!disabled,
    getOptionLabel: (option) => option.label,
    onChange: (event, selected) => {
      document.activeElement.blur();
      onChange(event, selected.map((option) => {
        if(freeSolo) {
          // when doing a free solo option, you dont get an object here, just a string
          return option.value ? option.value : option
        } else {
          return option.value
        }
      }))
    }
  });

  function renderSprite(option) {
    if(!option) return null

    if(option.textureId || option.textureTint) {
      return <SpriteWrapper><Sprite textureId={option.textureId} textureTint={option.textureTint}/></SpriteWrapper>
    }

    return null
  }

  function renderLabelText(option) {
    if(option.shortLabel) {
      return <>
        <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem' }} component="div" varient="subtitle2">{option.shortLabel}</Typography>
        <Typography sx={{ fontSize: '1rem' }} component="div">{option.label}</Typography>
      </>
    } else {
      return option.label
    }
  }

  function renderLabel(option, index) {
    return <li {...getOptionProps({ option, index })}>
        <span>
          {renderSprite(option)}
          {renderLabelText(option)}
        </span>
      <CheckIcon fontSize="small" />
    </li>
  }

  function renderOption (option, index) {
    if(hideRemoved) {
      if(option.isRemoved) return null
    }
    return renderLabel(option, index)
  }

  function renderGroup(group, groupIndex) {
      const previousIndextotal = groupedOptions.reduce((prev, current, index) => {
      if(index >= groupIndex) return prev
      return current.options.length + prev
    }, 0)
    return <GroupContainer>
      <GroupHeader>{group.group}</GroupHeader>
      {group.options.map((option, optionIndex) => {
        return renderOption(option, previousIndextotal + optionIndex)
      })}
    </GroupContainer>
  }

  return (
    <Root>
      <div {...getRootProps()}>
        {formLabel && <FormLabel {...getInputLabelProps()}>{formLabel}</FormLabel>}
        <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
          {inheritedValue.map((option, index) => {
            return <StyledTag 
              key={option.value}
              label={<>
                {renderSprite(option)}
                {renderLabelText(option)}
              </>}
              {...getTagProps({ index })}
            />
          })}
          <input {...getInputProps()}/>
        </InputWrapper>
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          {groupedOptions.map((options, groupIndex) => {
            if(groupBy) {
              return renderGroup(options, groupIndex)
            } else {
              return renderOption(options, groupIndex)
            }
          })}
        </Listbox>
      ) : null}
    </Root>
  );
}
/* eslint-enable react/prop-types */
