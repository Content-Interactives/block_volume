import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Container } from './ui/reused-ui/Container.jsx'

const BlockVolume = () => {
    // State Management
    const [length, setLength] = useState(6);
    const [width, setWidth] = useState(2);
    const [height, setHeight] = useState(3);
    const [volume, setVolume] = useState(0);
    const [userLength, setUserLength] = useState(1);
    const [userWidth, setUserWidth] = useState(1);
    const [userHeight, setUserHeight] = useState(1);
    const [isControlsHidden, setIsControlsHidden] = useState(false);
    const [instantShow, setInstantShow] = useState(false);
    const hideTimeoutRef = useRef(null);

    // Functions
    const generateRandomDimensions = () => {
        const newLength = Math.floor(Math.random() * 6) + 1;
        const newWidth = Math.floor(Math.random() * 6) + 1;
        const newHeight = Math.floor(Math.random() * 6) + 1;
        setLength(newLength);
        setWidth(newWidth);
        setHeight(newHeight);
        setVolume(newLength * newWidth * newHeight);
    };

    useEffect(() => {
        generateRandomDimensions();
        return () => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
        };
    }, []);
    
    const renderBlocks = (length, width, height) => {
        if (length <= 0 || width <= 0 || height <= 0) return null;

        const baseSquares = length * height; // Part 1: length × height (columns × rows)
        const topSquares = width * length;   // Part 2: width (rows) × length (columns)
        const sideSquares = width * height;  // Part 3: width (columns) × height (rows)

        // Sizing constants
        const baseCell = 18;   // px, base square side
        const depthCell = 8;  // px, depth thickness unit for top/side

        // Derived dimensions for dynamic positioning
        const baseWidthPx = length * baseCell;    // width of base face in px
        const baseHeightPx = height * baseCell;   // height of base face in px
        const depthPx = width * depthCell;        // depth offset in px (depends on width)
        const verticalAdjustRatio = 1; // increase to lower more
        const verticalAdjustPx = Math.round(depthPx * verticalAdjustRatio);
        const adjustedDepthY = Math.max(depthPx - verticalAdjustPx, 0);
        const sideNudgeRatio = 1; // increase to lower the side more
        const sideNudgePx = Math.round(depthPx * sideNudgeRatio);

        return (
            <div className="relative w-fit h-[35%] flex justify-center items-center mx-auto my-5">
                <div
                    className="relative"
                    style={{ paddingTop: `${depthPx}px`, paddingRight: `${depthPx}px` }}
                >
                {/* Part 1: Base face (length × height) */}
                <div
                    className="grid z-10"
                    style={{ gridTemplateColumns: `repeat(${length}, minmax(0, ${baseCell}px))` }}
                >
                    {Array.from({ length: baseSquares }).map((_, idx) => (
                        <div key={idx} className="aspect-square bg-orange-400 border-[1px] border-black" />
                    ))}
                </div>

                {/* Part 2: Top face (rows = width, columns = length) */}
                <div
                    className="absolute top-0 left-0 grid z-20"
                    style={{
                        gridTemplateColumns: `repeat(${length}, minmax(0, ${baseCell}px))`,
                        gridTemplateRows: `repeat(${width}, minmax(0, ${depthCell}px))`,
                        transformOrigin: 'top left',
                        transform: `translateX(${depthPx}px) translateY(-${adjustedDepthY}px) skewX(-45deg)`
                    }}
                >
                    {Array.from({ length: topSquares }).map((_, idx) => (
                        <div key={`top-${idx}`} style={{ height: `${depthCell}px` }} className="bg-orange-500 border-[1px] border-black" />
                    ))}
                </div>

                {/* Part 3: Side face (columns = width, rows = height) */}
                <div
                    className="absolute top-0 left-0 grid z-20"
                    style={{
                        gridTemplateColumns: `repeat(${width}, minmax(0, ${depthCell}px))`,
                        gridAutoRows: `${baseCell}px`,
                        transformOrigin: 'top left',
                        transform: `translateX(${baseWidthPx}px) translateY(${sideNudgePx}px) skewY(-45deg)`
                    }}
                >
                    {Array.from({ length: sideSquares }).map((_, idx) => (
                        <div key={idx} style={{ width: `${depthCell}px`, height: `${baseCell}px` }} className="bg-orange-600 border-[1px] border-black" />
                    ))}
                </div>

                {/* Dimension lines */}
                {/* Length (red) */}
                <div className='flex flex-col items-center justify-center gap-2'>
                    <div
                        className="absolute z-30 bg-red-500"
                        style={{
                            left: 0,
                            top: `${depthPx + baseHeightPx + 6}px`,
                            width: `${baseWidthPx}px`,
                            height: '2px'
                        }}
                    />
                    <div className='relative translate-y-4 z-30 text-red-500 text-xs font-bold select-none'>
                        L
                    </div>
                </div>

                {/* Height (blue) */}
                <div className={`absolute left-[-25px] flex flex-row items-center justify-center gap-2`} style={{ top: `${depthPx}px` }}>
                    <div className='text-blue-500 text-xs font-bold select-none'>
                        H
                    </div>
                    <div
                        className="z-30 bg-blue-500"
                        style={{
                            width: '2px',
                            height: `${baseHeightPx}px`
                        }}
                    />
                </div>

                {/* Width (green) - bottom edge with slight offset (robust positioning) */}
                <div
                    className="absolute top-0 left-0 z-30"
                    style={{
                        width: `${baseWidthPx}px`,
                        height: `${depthPx}px`,
                        transformOrigin: 'top left',
                        transform: `translateX(${depthPx + 10}px) translateY(${baseHeightPx - adjustedDepthY + 2}px) skewX(-45deg)`
                    }}
                >
                    <div
                        className="absolute bg-green-500"
                        style={{ left: `${baseWidthPx - 2}px`, top: 0, width: '2px', height: `${depthPx}px` }}
                    />
                    <div
                        className="absolute text-green-500 text-xs font-bold select-none"
                        style={{ left: `${baseWidthPx + 13}px`, top: `${depthPx / 2}px`, transform: 'skewX(45deg)' }}
                    >
                        W
                    </div>
                </div>
            </div>
        </div>
        )
    }

    const incrementLength = () => {
        setUserLength(prev => Math.min(6, prev + 1));
    };

    const decrementLength = () => {
        setUserLength(prev => Math.max(1, prev - 1));
    };

    const incrementWidth = () => {
        setUserWidth(prev => Math.min(6, prev + 1));
    };

    const decrementWidth = () => {
        setUserWidth(prev => Math.max(1, prev - 1));
    };

    const incrementHeight = () => {
        setUserHeight(prev => Math.min(6, prev + 1));
    };

    const decrementHeight = () => {
        setUserHeight(prev => Math.max(1, prev - 1));
    };

    const checkAnswer = () => {
        if (isControlsHidden) return;
        if (userLength === length && userWidth === width && userHeight === height) {
            confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
            setInstantShow(false);
            setIsControlsHidden(true);
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = setTimeout(() => {
                generateRandomDimensions();
                setInstantShow(true);
                setIsControlsHidden(false);
                setTimeout(() => setInstantShow(false), 0);
            }, 3000);
        }
    }

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
            {renderBlocks(length, width, height)}

            {/* Green Answer (visible while controls are hidden) */}
            <div className={`absolute bottom-[15%] flex justify-center items-center w-[100%] transition-opacity ${isControlsHidden ? 'duration-300' : 'duration-0'} ${isControlsHidden ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className='text-green-600 text-3xl md:text-4xl font-extrabold select-none'>
                    {volume}
                </div>
            </div>

            {/* Inputs */}
            <div className={`absolute bottom-[1%] flex flex-col justify-center items-center w-[100%] gap-2 p-5 pb-2 pt-2 transition-opacity ${instantShow ? 'duration-0' : 'duration-300'} ${isControlsHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className='flex flex-row justify-center items-center gap-2'>
                    <div className='w-[30%] flex flex-col justify-center items-center gap-2'>
                        <button 
                            className='w-6 h-6 flex items-center justify-center rounded-md bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-300 shadow-sm'
                            onClick={incrementLength}
                            aria-label='Increase Length'
                            >
                            ▲
                        </button>
                        <input 
                            type="text" 
                            readOnly
                            tabIndex={-1}
                            value={userLength}
                            className='w-[90%] text-center border-2 border-red-400 rounded-lg p-2 focus:outline-none shadow-sm select-none pointer-events-none text-gray-800' 
                            />
                        <button 
                            className='w-6 h-6 flex items-center justify-center rounded-md bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-300 shadow-sm'
                            onClick={decrementLength}
                            aria-label='Decrease Length'
                        >
                            ▼
                        </button>
                    </div>
                    <div>
                        ×
                    </div>
                    <div className='w-[30%] flex flex-col justify-center items-center gap-2'>
                        <button 
                            className='w-6 h-6 flex items-center justify-center rounded-md bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-300 shadow-sm'
                            onClick={incrementWidth}
                            aria-label='Increase Width'
                        >
                            ▲
                        </button>
                        <input 
                            type="text" 
                            readOnly
                            tabIndex={-1}
                            value={userWidth}
                            className='w-[90%] text-center border-2 border-green-400 rounded-lg p-2 focus:outline-none shadow-sm select-none pointer-events-none text-gray-800' 
                        />
                        <button 
                            className='w-6 h-6 flex items-center justify-center rounded-md bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-300 shadow-sm'
                            onClick={decrementWidth}
                            aria-label='Decrease Width'
                        >
                            ▼
                        </button>
                    </div>
                    <div>
                        ×
                    </div>
                    <div className='w-[30%] flex flex-col justify-center items-center gap-2'>
                        <button 
                            className='w-6 h-6 flex items-center justify-center rounded-md bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-300 shadow-sm'
                            onClick={incrementHeight}
                            aria-label='Increase Height'
                        >
                            ▲
                        </button>
                        <input 
                            type="text" 
                            readOnly
                            tabIndex={-1}
                            value={userHeight}
                            className='w-[90%] text-center border-2 border-blue-400 rounded-lg p-2 focus:outline-none shadow-sm select-none pointer-events-none text-gray-800' 
                        />
                        <button 
                            className='w-6 h-6 flex items-center justify-center rounded-md bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-300 shadow-sm'
                            onClick={decrementHeight}
                            aria-label='Decrease Height'
                        >
                            ▼
                        </button>
                    </div>
                </div>

                {/* Check Answer Button */}
                <div className={`flex justify-center w-full transition-opacity ${instantShow ? 'duration-0' : 'duration-300'} ${isControlsHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <button ref={null} onClick={checkAnswer} className='w-24 md:w-28 lg:w-32 text-center border-2 border-orange-400 bg-yellow-100 hover:bg-orange-200 text-orange-600 rounded-lg p-1 focus:outline-none shadow-sm placeholder-black'>Check!</button>
                    </div>
            </div>
        </Container>
    )
};


export default BlockVolume;