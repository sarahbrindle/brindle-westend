  <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
  <script src="https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyCMihcakBLTRiKnIpSckUGe3_spL_vftHE&ver=4.9.10" 
          type="text/javascript"></script>


<style type="text/css">
  

.gm-style-iw {
  width: 330px !important;
  top: 5px !important;
  left: 0px !important;
  background-color: #fff;
  box-shadow: 0 1px 6px rgba(178, 178, 178, 0.6);
  border: 1px solid rgba(72, 181, 233, 0.6);
  border-radius: 2px 2px 10px 10px;
}
#iw-container {
  margin-bottom: 10px;
}
#iw-container .iw-title {  
  font-size: 16px;
  font-weight: 700;
  padding-bottom: 10px;
  color: #000c23;
}
#iw-container .iw-content {
  font-size: 13px;
  line-height: 15px;
  font-weight: 400;
  margin-right: 1px;
  padding: 15px 5px 5px 15px;
  max-height: 140px;
  overflow-y: auto;
  overflow-x: hidden;
}
.iw-content img {
  float: left;
 margin-right: 10px;
}

.property-info{
  margin-right: 10px;
  color: #000c23;
}

.iw-content a{
  text-decoration: none;
  color: #000000;
}
.property-info .rentrange{
  font-size: 16px;
  font-weight: 700;
  color: #cc6839 !important;
  padding-top: 10px;
  display: block;
}
.property-img img{
  height: 80px !important;
}
.wp-block-eedee-block-gutenslider .eedee-gutenslider-nav{
  z-index: 100;
}
.eedee-gutenslider-nav{
  z-index: 1000!important;

}
</style>
<?php 
 $totalItem = wp_count_posts( 'neighborhood' )->publish;
?>
  <div id="map" style="width: 100%; height: 500px;"></div>

  <script type="text/javascript">

    <?php 

    // loop through rows (parent repeater)
    $i=0;
    $contentArray=array();
    $locationArray=array();
    query_posts(array('post_type' => 'neighborhood','post_status' => 'publish',
  'orderby' => 'date', 'order' => 'DESC' , 'posts_per_page' => -1));
   $return_string ='';
   if (have_posts()) :
      while (have_posts()) : the_post();
        $address = get_field('address');        
        $location_link = get_field('location_link');
        $content = apply_filters( 'the_content', get_the_content() );
        if (empty($address)) {
          $address = $content;
          $address = strip_tags($address); 
        }
        $address = trim(preg_replace('/\s\s+/', ' ', str_replace("\n", " ", $address)));
        if (empty($location_link)) {
          $location_link = 'https://maps.google.com/?q='.$address;
        }

        $item_map_lat_long = ''; 
        if(get_field('item_map_latitude_and_longitude')){
            $item_map_lat_long = get_field('item_map_latitude_and_longitude'); 
        }
 
   
    $contentString =  '<div id="iw-container"><div class="iw-content"><div class="property-info"><div class="iw-title">Location</div><p class="the-address">'.$address.'</p></div></div></div>';
  
    if($item_map_lat_long!=''){
        $contentArray[$i]=$contentString;
        $locString = $item_map_lat_long;
        $locationArray[$i]=$locString;
        $i++;
    }
    endwhile; 
    endif;
    ?>

    

    var locations = [
      <?php for($n=0;$n<$i;$n++){
        $actualStep = $n+1;
      ?>
          ['<?php echo $contentArray[$n];?>', <?php echo $locationArray[$n];?>, <?php echo $actualStep;?>]<?php if($actualStep<$totalItem){?>,<?php }?>
      <?php }?>
    ];

    var pinImage = new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/cc6839/");
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

    const svgMarker = {
      path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: "blue",
      fillOpacity: 0.6,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(15, 30),
    };


    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      icon: svgMarker,
      center: new google.maps.LatLng(40.4004257,-104.691141),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {  
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }
  </script>







<div id="horizontalTab">
<ul class="resp-tabs-list">


  <?php
    $args = array(
          'orderby' => 'name',
          'capability_type' => 'neighborhood',
          'taxonomy'=>'neighborhood_cat',
          'hide_empty'               => 0,
          'order' => 'ASC'
      );
      $categories = get_categories($args);
      $k=0;
      foreach($categories as $category) {
        $k=$k+1;
        $selected="";
        $tabname = $category->name;
        $tabname = str_replace('', '_', $tabname);
        $tabname = str_replace('/', '_', $tabname);
        $tabname = strtolower($tabname);
        if($k ==1 ){
            $selected='class="active"';
      }
      echo '<li class="tab-nav-'.$k.'" >' . $category->name.'</li> ';
    }
    ?>
  </ul>
<!--/.resp-tabs-list-->
<div class="resp-tabs-container">




<?php
    $args = array(
          'orderby' => 'name',
          'capability_type' => 'neighborhood',
          'taxonomy'=>'neighborhood_cat',
          'hide_empty'               => 0,
          'order' => 'ASC'
      );
      $categories = get_categories($args);
      $k=0;
      foreach($categories as $category) {
        $k=$k+1;
        $selected="";
        $tabname = $category->name;
        $tabname = str_replace('', '_', $tabname);
        $tabname = str_replace('/', '_', $tabname);
        $tabname = strtolower($tabname);
        if($k ==1 ){
            $selected=' in active';
      }
      ?>


<div class="tab-ct-<?php echo $k;?>">
<div class="tab-row">
	

	
	
<?php 

query_posts(array('post_type' => 'neighborhood','post_status' => 'publish',
  'tax_query' => array(
          array(
            'taxonomy' => 'neighborhood_cat',
            'field' => 'id',
            'terms' => $category->term_id
          )
        ),
  'orderby' => 'date', 'order' => 'DESC' , 'posts_per_page' => -1));
   $return_string ='';
   if (have_posts()) :
      while (have_posts()) : the_post();
        $address = get_field('address');
        $location_link = get_field('location_link');
        $content = apply_filters( 'the_content', get_the_content() );
        if (empty($address)) {
          $address = $content;
          $address = strip_tags($address); 
        }
        if (empty($location_link)) {
          $location_link = 'https://maps.google.com/?q='.$address;
        }
        
         $return_string = $return_string.'<div class="tab-grid" href="#"><a target="_blank" href="'.$location_link.'">';
         $return_string = $return_string.'<h4>'.get_the_title().'</h4>'.$content.'
                </a></div>';
      endwhile;
   endif;
   wp_reset_query();
   
   echo  $return_string;


?>


</div>
</div>
<!--/.tab-ct-01-->

<?php }?>






</div>
<!--/.resp-tabs-container-->
</div>
<!--/#horizontalTab-->





<script>
jQuery(document).ready(function () {
jQuery('#horizontalTab').easyResponsiveTabs({
type: 'default', //Types: default, vertical, accordion           
width: 'auto', //auto or any width like 600px
fit: true,   // 100% fit in a container
closed: 'accordion', // Start closed if in accordion view
});
});
</script>
