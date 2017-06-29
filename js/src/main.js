import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import $ from 'jquery';
import {drawLineChart} from './linechart';


const baseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
const map = new L.Map('map', {
    center: new L.latLng(35.03, 135.77),
    zoom: 10,
    minZoom: 6,
    maxZoom: 20,
    layers: [baseLayer],
    attributionCon: false,
});

let position_data = {}; // data in one place
//select position (default)
let selected_position = '35.0_135.8';
//select date (default)
let selected_date = '205101',
    year = 2051,
    month = 1;
filterDataset(selected_position, selected_date);

//'34.8_135.6', '34.8_135.8','35.0_135.6', '35.0_135.8','35.2_135.6', '35.2_135.8'
// postion change
const circle0 = L.circle([34.8, 135.6], 9000, {weight: 0, fillOpacity:0.2}).addTo(map);
circle0.on('click', () => {
    selected_position = '34.8_135.6';
    $('#position-selector').empty();
    $('#position-selector').append('data selected at lat:34.8, lng:135.6');
    circle0.setStyle({fillColor: 'red'});
    circle1.setStyle({fillColor: 'blue'});
    circle2.setStyle({fillColor: 'blue'});
    circle3.setStyle({fillColor: 'blue'});
    circle4.setStyle({fillColor: 'blue'});
    circle5.setStyle({fillColor: 'blue'});
    $('#linechart').empty();
    filterDataset(selected_position, selected_date);
});
const circle1 = L.circle([34.8, 135.8], 9000, {weight: 0, fillOpacity:0.2}).addTo(map);
circle1.on('click', () => {
    selected_position = '34.8_135.8';
    $('#position-selector').empty();
    $('#position-selector').append('data selected at lat:34.8, lng:135.8');
    circle1.setStyle({fillColor: 'red'});
    circle0.setStyle({fillColor: 'blue'});
    circle2.setStyle({fillColor: 'blue'});
    circle3.setStyle({fillColor: 'blue'});
    circle4.setStyle({fillColor: 'blue'});
    circle5.setStyle({fillColor: 'blue'});
    $('#linechart').empty();
    filterDataset(selected_position, selected_date);
});
const circle2 = L.circle([35.0, 135.6], 9000, {weight: 0, fillOpacity:0.2}).addTo(map);
circle2.on('click', () => {
    selected_position = '35.0_135.6';
    $('#position-selector').empty();
    $('#position-selector').append('data selected at lat:35.0, lng:135.6');
    circle2.setStyle({fillColor: 'red'});
    circle0.setStyle({fillColor: 'blue'});
    circle1.setStyle({fillColor: 'blue'});
    circle3.setStyle({fillColor: 'blue'});
    circle4.setStyle({fillColor: 'blue'});
    circle5.setStyle({fillColor: 'blue'});
    $('#linechart').empty();
    filterDataset(selected_position, selected_date);
});
const circle3 = L.circle([35.0, 135.8], 9000, {fillColor: 'red', weight: 0, fillOpacity:0.2}).addTo(map);
circle3.on('click', () => {
    selected_position = '35.0_135.8';
    $('#position-selector').empty();
    $('#position-selector').append('data selected at lat:35.0, lng:135.8');
    circle3.setStyle({fillColor: 'red'});
    circle0.setStyle({fillColor: 'blue'});
    circle1.setStyle({fillColor: 'blue'});
    circle2.setStyle({fillColor: 'blue'});
    circle4.setStyle({fillColor: 'blue'});
    circle5.setStyle({fillColor: 'blue'});
    $('#linechart').empty();
    filterDataset(selected_position, selected_date);
});
const circle4 = L.circle([35.2, 135.6], 9000, {weight: 0, fillOpacity:0.2}).addTo(map);
circle4.on('click', () => {
    selected_position = '35.2_135.6';
    $('#position-selector').empty();
    $('#position-selector').append('data selected at lat:35.2, lng:135.6');
    circle4.setStyle({fillColor: 'red'});
    circle0.setStyle({fillColor: 'blue'});
    circle1.setStyle({fillColor: 'blue'});
    circle2.setStyle({fillColor: 'blue'});
    circle3.setStyle({fillColor: 'blue'});
    circle5.setStyle({fillColor: 'blue'});
    $('#linechart').empty();
    filterDataset(selected_position, selected_date);
});
const circle5 = L.circle([35.2, 135.8], 9000, {weight: 0, fillOpacity:0.2}).addTo(map);
circle5.on('click', () => {
    selected_position = '35.2_135.8';
    $('#position-selector').empty();
    $('#position-selector').append('data selected at lat:35.2, lng:135.8');
    circle5.setStyle({fillColor: 'red'});
    circle0.setStyle({fillColor: 'blue'});
    circle1.setStyle({fillColor: 'blue'});
    circle2.setStyle({fillColor: 'blue'});
    circle3.setStyle({fillColor: 'blue'});
    circle4.setStyle({fillColor: 'blue'});
    $('#linechart').empty();
    filterDataset(selected_position, selected_date);
});

// generate date selector
$('#date-selector').append('<form id="selected-form"> date: <select id="year"></select><select id="month"></select></form>');
for(let y=2051;y<=2099;y++){
    $('#year').append(`<option value="${y}">${y}</option>`);
}
for(let m=1;m<=12;m++){
    $('#month').append(`<option value="${m}">${m}</option>`);
}

// date change
$('#date-selector').on('change', () => {
    $('#linechart').empty();
    year = $('#year').val();
    month = $('#month').val();
    selected_date = year.toString() + (month<10 ? '0' + month.toString() : month.toString());
    drawLineChart(position_data[selected_date], year, month);
});

function filterDataset(position, date){
    // position: '35.0_135.6' date: '205101'
    $.getJSON('../asset/dataset.json', data => {
        position_data = data[position];
        const display_data = position_data[date];
        drawLineChart(display_data, year, month);
    });
}
