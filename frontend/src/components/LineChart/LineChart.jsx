import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data, forceMin=null, forceMax=null, topPadding=50 }) => {
    const svgRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const circleRadius = 6;
    const animationDuration = 500;
    const initialDelay = 500;

    useEffect(() => {
        // Set up resize event listener
        function handleResize() {
            const parentWidth = svgRef.current.parentElement.clientWidth;
            const parentHeight = svgRef.current.parentElement.clientHeight;
            setDimensions({ width: parentWidth, height: parentHeight });
        }

        handleResize(); // Initial setup
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (dimensions.width && dimensions.height) {
            updateChart();
        }
    }, [data, dimensions]);

    const getCSSVariableValue = (variableName) => {
        const body = document.documentElement;
        
        // Get the computed style
        const style = getComputedStyle(body);
        
        // Return the value of the CSS variable
        return style.getPropertyValue(variableName);
    };
    

    // Function to get the color from the gradient at a specific percentage
    const getColorFromGradient = (percentage) => {
        try {
            const gradient = d3.select("#lineGradient").node(); // Get the gradient node
            const stops = gradient.children;
    
            // Create a temporary canvas for color extraction
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
    
            // Create a linear gradient on the canvas
            const canvasGradient = ctx.createLinearGradient(0, 0, 100, 0); // Assume 100px width for the gradient
            for (let i = 0; i < stops.length; i++) {
                canvasGradient.addColorStop(
                    parseFloat(stops[i].getAttribute('offset')) / 100,
                    stops[i].getAttribute('stop-color')
                );
            }
    
            // Set the gradient as fill style and fill a rectangle
            ctx.fillStyle = canvasGradient;
            ctx.fillRect(0, 0, 100, 1); // Fill a rectangle of width 100px
    
            // Get the pixel data at the given percentage
            const pixelX = Math.floor(percentage * 100); // 100px width
            const pixelData = ctx.getImageData(pixelX, 0, 1, 1).data;
    
            const color = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
            if (color === 'rgba(0, 0, 0, 0)') return stops[stops.length - 1].getAttribute('stop-color');
            // Return the color in rgba format
            return color;
        } catch {
            return "white";
        }
    };

    const createCircles = (chart, x, y, margin) => {
        const yAvg = d3.mean(data, d => d.y);
        const circles = chart.selectAll(".circle")
            .data(data)
            .enter().append("circle")
            .attr("class", "circle")
            .attr("cx", d => x(d.x) + margin.left)  // X value remains the same
            .attr("cy", d => y(d.y) + margin.top)  // Y value as per your requirement
            .attr("r", circleRadius) // Set your desired radius
            .attr("fill", (d, i) => {
                const percentage = (i / (data.length - 1)); // Calculate percentage based on index
                return getColorFromGradient(percentage); // Get the corresponding color from the gradient
            });

        return circles;
    };

    const updateChart = () => {
        const svg = d3.select(svgRef.current);
        
        // Clear existing content
        svg.selectAll("*").remove();

        const margin = { top: 10, right: 20, bottom: 30, left: 50 };
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        // Set up the SVG canvas
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Set up the scales
        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.x)])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([forceMin === null ? 0 : forceMin, forceMax === null ? d3.max(data, d => d.y) + topPadding : forceMax])
            .range([height, 0]);

        // Create line
        const line = d3.line()
            .x(d => x(d.x))
            .y(d => y(d.y));

            // Define the linear gradient
    const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "lineGradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

    // Add color stops to the gradient
    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", getCSSVariableValue("--orange"))  // Start color
        .attr("stop-opacity", 1);


    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", getCSSVariableValue("--pink"))  // End color
        .attr("stop-opacity", 1);

        // Add the line path
        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "url(#lineGradient)")
            .attr("stroke-width", 4)
            .attr("d", line);

        const circles = createCircles(svg, x, y, margin);
    
        // Transition squares to their actual y-value positions
        circles.transition()
            .delay(initialDelay) // Delay at first to match line transition
            .duration(animationDuration)
            .attr("cy", d => y(d.y) + margin.top); // Transition to the actual y-value position

        // Append axes without x-axis title
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(0)); // Remove ticks from x-axis

        // Append y-axis with labels and ticks
        g.append("g")
            .call(d3.axisLeft(y));
    };

    return (
        <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
    );
};

export default LineChart;