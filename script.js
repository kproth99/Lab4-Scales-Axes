d3.csv("wealth-health-2014.csv", d3.autoType).then((data) => {
    console.log("WealthHealth", data);
    WealthHealth = data
    console.log(WealthHealth);
    const margin = {top:20, left:25, bottom:20, right:20};
    const width = 650-margin.left- margin.bottom;
    const height = 500 - margin.top - margin.bottom;

    minmax = d3.extent(WealthHealth.map(function(item){
        return( item.Income);
        }))
         incomeMin = minmax[0];
         incomeMax = minmax[1];

    function sortNumbers(a, b) {
            return a - b;
          }
    populationnumber = d3.extent(WealthHealth.map(function(item){
            return(item.Population);
            }))

             populationnumber.sort(sortNumbers);
             console.log(populationnumber);
    
    const svg = d3.select('.chart').append('svg')
        .attr('width', width+margin.left +margin.right)
        .attr('height', height+ margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate('+margin.left+','+margin.right+')')
        
    const xScale = d3.scaleLinear()
        .domain(d3.extent(WealthHealth.map(function(item){
            return(item.Income);
        })))
        .range([0,width]);
    
    console.log(xScale(incomeMax));

    const yScale = d3.scaleLinear()
        .domain(d3.extent(WealthHealth.map(function(item){
        return(item.LifeExpectancy);
        })))
        .range([height,0]);
    
    const colorScale = d3.scaleOrdinal(WealthHealth.map(d => d.Region), d3.schemeSet2);
    const formater =  d3.format(','); //format function
   
    
    svg
        .selectAll("dot")
        .data(WealthHealth)
        .enter()
        .append('circle')
        .attr("fill", d => colorScale(d.Region))
        .attr("fill-opacity","50%")
        .attr('stroke','grey')
        .attr('cx', d=>xScale(d.Income))
        .attr('cy', d=>yScale(d.LifeExpectancy))
        .attr("r", function(d){
            if (d.Population > 1000000000){
                return 20;
            }
            else if (d.Population > 100000000){
                return 8;
            }
            else if (d.Population > 10000000){
                return 5;
            }
            else if (d.Population > 1000000){
                return 4;
            }
            else {
                return 3;
            }
        })
        .on("mouseenter", (event, d) => {
        const pos = d3.pointer(event, window)
           d3.select('.tooltip')
             .style("opacity", 1)
             .style("left", (pos[0] + 10 + "px"))
             .style("background-color", "rgba(44, 85, 175, 0.75)")
             .style("top", (pos[1] + 10 + "px"))
             .html(`Country:  ${d.Country} <br> Life Expectancy:  ${d.LifeExpectancy} <br> Population:  ${d3.format(",d")(d.Population)} <br> Income:  ${d3.format("$,d")(d.Income)}  <br> Region:  ${d.Region}`);
         })
   
         .on("mouseleave", (event, d) => {
           d3.select('.tooltip').style("opacity", 0)
         });
     

    const xAxis = d3.axisBottom(xScale)
        .ticks(5,'s');
    const yAxis = d3.axisLeft(yScale)
         .ticks(5,'s');
   
    svg.append('g')
        .attr("class", "axis y-axis")
        .call(yAxis);

    svg.append('g')
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`);

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Income (US Dollars)")

    svg.append("text")
        .attr("class", "y label")
        .attr("x", -margin.left)
        .attr("y", -5)
        .attr("text-anchor", "start")
        .text("Life expectancy (Years)");

        var legendRectSize = 18;                                  
        var legendSpacing = 5;  
        
    const legend = svg.selectAll('.legend')                     
        .data(colorScale.domain())                                   
        .enter()                                                
        .append('g')                                            
        .attr('class', 'legend')
        .attr('transform', function(d, i) {                     
              var height = legendRectSize + legendSpacing;          
              var offset =  height * colorScale.domain().length / 2;     
              var horz = -2 * legendRectSize + 450;                       
              var vert = i * height - offset + 350;                       
              return 'translate(' + horz + ',' + vert + ')';        
            });        
        legend.append('rect')
          .attr('width', legendRectSize)     
          .attr('height', legendRectSize)           
          .style('fill', colorScale) 
          .style('stroke', colorScale)   
        legend.append('text')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', legendRectSize - legendSpacing)
          .text(function(d){ return d;});
        
        
        

});