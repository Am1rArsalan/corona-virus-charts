import React from 'react';
import classes from './button.module.scss' ; 

export default function (props) {
    return (
        <button 
              className={classes.root} 
              onClick={props.onAddDataset}>
            {props.text}
        </button>
    )
}