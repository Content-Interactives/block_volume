import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Container } from './ui/reused-ui/Container.jsx'

const BlockVolume = () => {


	return (
        <Container
            text="Block Volume" 
            borderColor="#FF7B00"
            showSoundButton={true}
        >
            {/* Intro Text */}
            <div className='text-center text-sm text-gray-500 p-5 pb-0 flex-start'>
                Find the volume of this prism by multiplying the <span className='font-bold text-red-500'>length</span>, <span className='font-bold text-green-500'>width</span>, and <span className='font-bold text-blue-500'>height</span>.
            </div>

            {/* Block Stack */}
        </Container>
    )
};


export default BlockVolume;