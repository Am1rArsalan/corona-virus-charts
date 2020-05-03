import React from 'react';

export default function (props) {
    return (
        <canvas
            ref={props.chartRef}
            id={props.chartId}
            height={props.height}
            width={props.width}></canvas>
    )
}
