
function plotMe() {


    var myPlot = document.getElementById('plot');

    var data = [];
    for (var i = 1; i < 4; i++)
        addPipe(data, i.toString());

    var layout = {
        title: 'Flow Rate vs Pipe Fill',
        xaxis: {
            title: 'Fill Ratio [%]'
        }, 
        yaxis: {
            title: 'Flow [m^3/hr]'
        }
    }
    Plotly.newPlot('plot', data, layout, {editable: true});

    /*myPlot.on('plotly_click', function(){
        alert('You clicked this Plotly chart!');
    });*/

    myPlot.on('plotly_click', function(data){
        var pts = '';
        for(var i=0; i<data.points.length; i++){
            
            annotate_text = 'x = '+data.points[i].x +
                          ', y = '+data.points[i].y.toPrecision(4);
            
            annotation = {
              text: annotate_text,
              x: data.points[i].x,
              y: parseFloat(data.points[i].y.toPrecision(4))
            }
            annotations = plot.layout.annotations || [];
            annotations.push(annotation);
            Plotly.relayout('plot',{annotations: annotations})
        }
    });
}

function addPipe(data, pipeNum) {
    if (document.getElementById('pipe'+ pipeNum).checked){
        let D = 0.001*parseFloat( document.getElementById('txt_D' + pipeNum).value );
        let slope = 0.01*parseFloat( document.getElementById('txt_slope' + pipeNum).value );
        let nmSlope = 'txt_slope' + pipeNum;
        data.push(calcLine(D,slope));
        //return calcLine(D,slope);
}
    return;

function calcLine(D, slope) {
    
    n = 0.011;  // Manning coefficient
    r = D / 2;  // radius

    fill = makeArr(0, 1, 101);

    let Q = fill.map(function(f){
        if (f<=0.5) {
            var q = 2*Math.acos(1-2*f);
            var A = r**2 * (q - Math.sin(q)) / 2;
            var rh = A / (r * q);
        } else // f > 0.5
        {
            var q = 2*Math.acos(2*f-1);
            var A = Math.PI * r**2 - r**2 * (q - Math.sin(q)) / 2;
            var rh = A / (2*r * Math.PI - r * q);
        }

        let Q = A / n * rh**(2/3) * Math.sqrt(slope) * 3600;   // flow [m^3/hr]
        return Q;   // flow [m^3/hr]
    });
    var trace = {
        x: fill, 
        y: Q, 
        name: 'pipe'+ pipeNum,
        type: 'scatter'
    }
    return trace;
}
}

function makeArr(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
        arr.push(startValue + (step * i));
    }
    return arr;
}