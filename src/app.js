console.log('JS running');
import lazysizes from 'lazysizes';
import objectFitImages from 'object-fit-images';
import Flickity from 'flickity';

var elem = document.querySelector('.main-carousel');
var flkty = new Flickity( elem, {
  cellAlign: 'center',
  contain: true,
  pageDots: false,
  wrapAround: true,
  setGallerySize: false
});
