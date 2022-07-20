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
