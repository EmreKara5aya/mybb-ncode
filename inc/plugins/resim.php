<?php
/* 
			@Emre Karakaya
			@www.emrekarakaya.com.tr
*/
if (!defined("IN_MYBB")) {
	die("Direct initialization of this file is not allowed.<br /><br />Please make sure IN_MYBB is defined.<br />Mybb Dışı Bağlanmak Yasaktır.");
} // Mybb Dışı Bağlantıları Engelliyoruz
$plugins->add_hook("global_start", "resim_degisken");
function resim_info()
{
    global $lang;
     $lang->load("resim");
// Eklentiyi Tanıtıyoruz
	return array(
	'name' => $lang->eklentiad , //Eklenti'nin Adı
	'description' => $lang->eklentiac , //Eklentinin Açıklaması
	'website' => "http://www.mybb.com.tr" , // Eklentinin Websitesi
	'author' => "Emre Karakaya" , // Eklenti Yapımcısı
	'authorsite' => "http://www.emrekarakaya.com.tr" , // Eklenti Yapımcısının Sitesi
	'version' => "1.0" , // Eklenti Versiyonu
	'guid' => "" , // Eklenti için Verilen kod.Detayları Videoda
	'compatibility' => "18*", // Eklenti uyumlu olduğu Mybb Sürümleri
);
}
function resim_activate()
{
	global $mybb, $db, $cache, $lang, $settings;
    $lang->load("resim");
$mykod1 = array_map(array($db, 'escape_string'), array(
    "title"           => "Ncode1",
    "description"     => "Ncode1",
    "regex"           => "\[img\](.*?)\[/img\]",
    "replacement"     => "<img src=\"$1\" border=\"0\" alt=\"resim\" onload=\"NcodeImageResizer.createOn(this);\" />",
    "active"           => "1",
    "parseorder"           => "",
    ));
    $db->insert_query("mycode", $mykod1);
	
	$mykod2 = array_map(array($db, 'escape_string'), array(
    "title"           => "Ncode2",
    "description"     => "Ncode2",
    "regex"           => "\[align=(.*?)\](.*?)\[/align\]",
    "replacement"     => "<div align=\"$1\">$2</div>",
    "active"           => "1",
    "parseorder"           => "",
    ));
    $db->insert_query("mycode", $mykod2);
	$cache->update_mycode();
   
	 $ayar_group = array(
        'name'         => 'resim_ayarlari',
        'title'        => $lang->aygrtitle,
        'description'  => $lang->aygrdes,
        'disporder'    => '1',
    );
    $db->insert_query('settinggroups', $ayar_group);
    $ayar_grup_id = $db->insert_id();
	$ayar1 = array(
        'name'         => 'nmode',
        'title'        => $lang->nmodetit,
        'description'  => $lang->nmodedes,
        'optionscode'  => "select\nenlarge=$lang->enlarge\nsamewindow=$lang->samewindow\nnewwindow=$lang->newwindow\nncodebox=$lang->ncodebox",
        'value'        => 'enlarge',
        'disporder'    => '0',
        'gid'          => intval( $ayar_grup_id )
    );
    $db->insert_query("settings", $ayar1);
    	$ayar2 = array(
        'name'         => 'ntema',
        'title'        => $lang->ntematit,
        'description'  => $lang->ntemades,
        'optionscode'  => "select\nxpserkan=$lang->xpserkan\nncode16=$lang->ncode16\nncodewp=$lang->ncodewp",
        'value'        => 'xpserkan',
        'disporder'    => '0',
        'gid'          => intval( $ayar_grup_id )
    );
    $db->insert_query("settings", $ayar2);
        	$ayar3 = array(
        'name'         => 'ngen',
        'title'        => $lang->ngentit,
        'description'  => $lang->ngendes,
        'optionscode'  => 'text',
        'value'        => '500',
        'disporder'    => '0',
        'gid'          => intval( $ayar_grup_id )
    );
    $db->insert_query("settings", $ayar3);
        	$ayar4 = array(
        'name'         => 'nyuk',
        'title'        => $lang->nyuktit,
        'description'  => $lang->nyukdes,
        'optionscode'  => 'text',
        'value'        => '0',
        'disporder'    => '0',
        'gid'          => intval( $ayar_grup_id )
    );
    $db->insert_query("settings", $ayar4);
     rebuild_settings();
 require_once MYBB_ROOT."/inc/adminfunctions_templates.php";
    find_replace_templatesets("headerinclude", "#".preg_quote("{\$stylesheets}")."#i", "{\$stylesheets}\n{\$ncode}");

}
function resim_deactivate()
{
	global $mybb, $db, $cache, $lang, $settings;
     require_once MYBB_ROOT."/inc/adminfunctions_templates.php";
    find_replace_templatesets("headerinclude", "#".preg_quote("{\$ncode}")."#i", "", 0);
$db->query("DELETE FROM ".TABLE_PREFIX."mycode WHERE title='Ncode1'");
$db->query("DELETE FROM ".TABLE_PREFIX."mycode WHERE title='Ncode2'");
$cache->update_mycode();
 $db->query("DELETE FROM ".TABLE_PREFIX."settinggroups WHERE name='resim_ayarlari'");

    $db->query("DELETE FROM ".TABLE_PREFIX."settings WHERE name='nmode'");
    $db->query("DELETE FROM ".TABLE_PREFIX."settings WHERE name='ntema'");
    $db->query("DELETE FROM ".TABLE_PREFIX."settings WHERE name='nyuk'");
    $db->query("DELETE FROM ".TABLE_PREFIX."settings WHERE name='ngen'");
rebuild_settings();
}

function resim_degisken()
{
    global $mybb, $ncode, $lang;
$lang->load("resim");
    $ncode = "<link type=\"text/css\" rel=\"stylesheet\" href=\"{$mybb->settings['bburl']}/ncode/{$mybb->settings['ntema']}.css\" />
<script type=\"text/javascript\" src=\"{$mybb->settings['bburl']}/ncode/ncodebox.js\"></script>
<script type=\"text/javascript\">
<!--
NcodeImageResizer.MODE = '{$mybb->settings['nmode']}';
NcodeImageResizer.MAXWIDTH = {$mybb->settings['ngen']};
NcodeImageResizer.MAXHEIGHT = {$mybb->settings['nyuk']};
NcodeImageResizer.BBURL = '{$mybb->settings['bburl']}/ncode/{$mybb->settings['ntema']}.png';
  
var NcodeBoxBilgi = new Array();
NcodeBoxBilgi['ncode_imageresizer_warning_small'] = '{$lang->nbuy}';
NcodeBoxBilgi['ncode_imageresizer_warning_filesize'] = '{$lang->norjj}';
NcodeBoxBilgi['ncode_imageresizer_warning_no_filesize'] = '{$lang->norj}';
NcodeBoxBilgi['ncode_imageresizer_warning_fullsize'] = '{$lang->nkuc}';
//-->
</script>";
}
?>