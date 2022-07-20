  <link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri();?>/cpt/map/assets/wp-google-map.css">
  <script>
      var siteSettings = {"breakpoints":{"xlarge":1680,"large":1380,"medium":1180,"small":980,"fluid":800,"fluid_medium":660,"fluid_small":480,"fluid_xsmall":360},"sticky_header":"desktop_mobile","theme":1};      
      var useSiteAnimations = true;
      var theme = 1;
     var config = jcms = {"siteUrl":""};</script>
  </head>
<body>

  <?php 
     $mapString ='';
    $catNumber = 0;
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
      $currentCategory = $category->name;
      $catNumber = $category->cat_ID;


   
    // loop through rows (parent repeater)
    $i=0;
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
        $content = strip_tags($content); 

        $content = str_replace(array("\n", "\t", "\r"), ' ', $content);

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
        
 
    if($item_map_lat_long!=''){

          $locationItemNumber = get_the_id();
          $locaTitle = get_the_title();
          $item_map_lat_long_array = explode(",",$item_map_lat_long);
          $latitude = $item_map_lat_long_array[0];
          $longitude = $item_map_lat_long_array[1];


          $contentString =  '{"id":'.$locationItemNumber.',"category":'.$catNumber.',"name":"'.$locaTitle.'","address":"'.$content.'","map_url":"'.$location_link.'","website":"","lat":"'.$latitude.'","lng":"'.$longitude.'","icon":"poi_icon_cook_dome"}';

          
          $mapString = $mapString.','.$contentString;
          
    }
    /* start pin*/
    
    $catNumberPin = $catNumber;
    $locationItemNumberPin = 10000;
    $locaTitlePin = get_field('company_name_for_map', 'option');
    $item_map_lat_longPin = get_field('map_center_for_map', 'option');
    $item_map_lat_long_arrayPin = explode(",",$item_map_lat_longPin);
    $latitudePin = $item_map_lat_long_arrayPin[0];
    $longitudePin = $item_map_lat_long_arrayPin[1];
    $contentPin = get_field('company_address_for_map', 'option');
    $contentPin = strip_tags($contentPin);
    $contentPin = str_replace(array("\n", "\t", "\r"), ' ', $contentPin);           
    $location_linkPin = get_field('company_google_map_location', 'option');

    $contentStringPin =  '{"id":'.$locationItemNumberPin.',"category":'.$catNumberPin.',"name":"'.$locaTitlePin.'","address":"'.$contentPin.'","map_url":"'.$location_linkPin.'","website":"","lat":"'.$latitudePin.'","lng":"'.$longitudePin.'","icon":"poi_icon_hotel"}';
    $mapString = $mapString.','.$contentStringPin;
    
    $mapLatitudeCenter = $latitudePin;
    $mapLongitudeCenter = $longitudePin;
    $mapZoom = get_field('zoom_for_map', 'option');
    $mapDefaultCategory = 6;
    /*end pin*/


    $mapString = rtrim($mapString, ',');
    $mapString = ltrim($mapString, ',');
    endwhile; 
    endif;
  }
    ?>

<script>
  var neighborhoodSettings = {
    layout: "2"  }
  var mapSettings = {
    style: null,
    pois: [<?php echo $mapString;?>],
    companyName: "",
    defaultCategory: '<?php echo $mapDefaultCategory;?>',
    assetPath: "assets/",
    lat: '<?php echo $mapLatitudeCenter;?>',
    lng: '<?php echo $mapLongitudeCenter;?>',
    loadAll: 0,
    loadInfobox: 0,
    persistPinpoint: <?php echo get_field('persist_pin_point', 'option');?>,
    defaultMapZoom: <?php echo $mapZoom;?>,
    areaHighlight: {
      coordinates: [],
      color: "",
      opacity: ""
    },
    homeMarker: {
      size: "small",
      color: "666666"
    }
  }
</script>
<script type="text/template" id="main-infobox-template">
  <div class="map__infobox-modal map__infobox-modal--pinpoint-only">
    <div class="map__infobox-pinpoint-wrap">
      <div class="map__infobox-pinpoint-svg"><svg enable-background="new 0 22.4 22.5 22.9" height="22.9" viewBox="0 22.4 22.5 22.9" width="18px" height="18px" xmlns="http://www.w3.org/2000/svg"><g fill="#0C0058"><path d="m12.2 20.9-1.7 2-1.7-2z"/><circle cx="7.5" cy="7.5" r="7.5"/></g></svg></div>
              <img class="map__infobox-pinpoint-icon map__infobox-pinpoint-icon--in-circle" width="18" height="18" src="<?php echo get_field('map_icon', 'option');?>" alt="map icon" title="Map Icon">
          </div>

       </div>
</script>
<script type="text/template" id="infobox-template">
    <div class='map__infobox-poi'>
    <p class='map__infobox-poi-address'>
      <strong class='map__infobox-poi-address-header'>
        {{name}}
      </strong>
      {{address}}
    </p>
    <a class='map__infobox-poi-link' href='{{map_url}}' target='_blank'>
      Get Directions
    </a>

    {{if website}}
      <a class='map__infobox-poi-link' href='{{website}}' target='_blank'>
        Visit Website
      </a>
    {{endif}}
    </div>
</script>

<div style="display:none">
       <?php
        $catNumber = 0;
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
          $currentCategory = $category->name;
          $catNumber = $category->cat_ID;

      ?>

      <div id="poi_icon_cook_dome" data-category="<?php echo $catNumber;?>" data-fill="#333">
          <svg width="36px" height="36px" viewBox="-4 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <!-- Uploaded to SVGRepo https://www.svgrepo.com -->
              <title>map-marker</title>
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Vivid.JS" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="Vivid-Icons" transform="translate(-125.000000, -643.000000)">
                      <g id="Icons" transform="translate(37.000000, 169.000000)">
                          <g id="map-marker" transform="translate(78.000000, 468.000000)">
                              <g transform="translate(10.000000, 6.000000)">
                                  <path d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z" id="Shape" fill="#FF6E6E"></path>
                                  <circle id="Oval" fill="#0C0058" fill-rule="nonzero" cx="14" cy="14" r="7"></circle>
                              </g>
                          </g>
                      </g>
                  </g>
              </g>
          </svg>
      </div>

      
      <?php }?>
    
  </div>

 
  
  <div class="neighborhood-b">
    <div class="map-a page--zindex-high" id="neighborhood-map-body">
      <div class="map-a__body wow slideInLeft">
        <div class="map-a__canvas map-a__canvas--without-infobox" id="map_canvas">
        </div>
        <div class="map-a__nav">
          <div class="map-a__nav-item map-a__nav-item--control map-a__nav-item--zoom-out" id="zoom_out"></div>
          <div class="map-a__nav-item map-a__nav-item--control map-a__nav-item--zoom-in" id="zoom_in"></div>
          <div class="map-a__nav-item map-a__nav-item--control map-a__nav-item--refresh" id="refresh"></div>
        </div>
        
      </div>


      <div class="map-a__cat-wrap wow slideInRight">
        <div class="map-a__cat-select-wrap">
          <p class="map-a__cat-select-label">Select a Category: </p>
          <div class="map-a__cat-select">
            <button class="map-a__cat-selected" title="category-select-link" id="category-select-link">
                          </button>
            <div class="map-a__cat-options" id="category-select-options">
                                            
                  <?php
                  $catNumber = 0;
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
                    $currentCategory = $category->name;
                    $catNumber = $category->cat_ID;

                ?>
                <div class="map-a__cat-item map-a__cat-item--category">
                  <button data-js-hook="poi-filter" data-poi="<?php echo $catNumber;?>" class="map-a__cat-link">
                   <span class="map-a__cat-link-table">
                      
                      <span class="map-a__cat-link-column">
                        <?php echo $currentCategory;?>                       
                      </span>
                    </span>
                  </button>
                </div>
                <?php }?>
              </div>
          </div>
        </div>
      </div>
    </div>

    <div class="neighborhood-b__poi-wrap wow fadeInUp">
            <?php
                  $locationItemNumber = 0;
                  $catNumber = 0;
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
                    $currentCategory = $category->name;
                    $catNumber = $category->cat_ID;

                ?>


             <div <?php if($catNumber != 6){ ?> style="display:none;" <?php }?> class="neighborhood-b__poi " data-js-hook="poi-category" data-category="<?php echo $catNumber;?>" >
          <div class="neighborhood-b__poi-container">
            <div class="neighborhood-b__poi-category-header">
              <div class="neighborhood-b__poi-category-header-container">               
                <div class="neighborhood-b__poi-category-header-column">
                  
                </div>
              </div>
            </div>
            <ul class="neighborhood-b__poi-category-list">                
                
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
                          $address = strip_tags($address);
                          $locationItemNumber++;
                          $locationItemNumber = get_the_id();

                        ?>
                <li  class="neighborhood-b__poi-category-list-item ">
                  <button class="neighborhood-b__poi-category-item-link" data-js-hook="toggle-poi-infobox" data-poi-id="<?php echo $locationItemNumber;?>">
                    <span class="neighborhood-b__poi-category-item-title">
                      <div class="tab-grid">
                          <h4><?php echo get_the_title();?></h4>
                        <?php echo $content;?>
                      </div>
                    </span>
                  </button>
                </li>
                <?php endwhile;
                endif;
                wp_reset_query();
              ?> 
                          </ul>
                      </div>
        </div>
      <?php }?>                   
          </div>
  </div>




<script src="//maps.google.com/maps/api/js?v=quarterly&key=AIzaSyCMihcakBLTRiKnIpSckUGe3_spL_vftHE"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="<?php echo get_stylesheet_directory_uri();?>/cpt/map/assets/wp-google-map.js"></script>

