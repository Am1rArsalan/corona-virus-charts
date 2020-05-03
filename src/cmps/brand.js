import React from 'react'
import classes from './brand.module.scss' ; 


export default function (props) {
    return (
        <a
            className={classes.root}
            href={props.linkToSource}
        >
            {props.firstName} <br />  {props.lastName}
        </a>
    )
}
