<?php
session_start();
global $landUrl;
class WhoCpaLead {
    public function __construct() {
        $this->_api_url = 'https://api.whocpa.asia/lead/new_send_lead.php';        
        $this->_api_key = 'V_YwofM4M34pHv1d'; //V_YwofM4M34pHv1d
        $this->_aff_id  = 1015548765;
        $this->_offer_id = 6045;
    }    

    public function requireToVar($file){
        ob_start();
        require($file);
        return ob_get_clean();
    }

    public function showWhite($lp) {
        $whiteCont = $this->requireToVar($lp."/index.html");
        print $whiteCont;
    }

    public function showLand() {
        global $land;
        global $landUrl;
        $land    = true;
        $landUrl = "";
        $_SESSION['binom_click_path'] = "/home/admin/web/trk22.perfectinstall.net/public_html/click.php";
        $_SESSION['camp_key']         = "22910mz63bl051j5tnlu";
        
        include_once($_SESSION['binom_click_path']);        
        $landUrl = str_replace("http://".$_SERVER['HTTP_HOST']."/", "", $landUrl);
        $landUrl = str_replace("http://www.".$_SERVER['HTTP_HOST']."/", "", $landUrl);
        $landUrl = str_replace("https://".$_SERVER['HTTP_HOST']."/", "", $landUrl);
        $landUrl = str_replace("https://www.".$_SERVER['HTTP_HOST']."/", "", $landUrl);        
        $this->showWhite($landUrl);
        unset($_SESSION['preland_path']);
    }

    public function thanksPage($args) {
        $file_name = "logs/orders/".$_SERVER['REMOTE_ADDR']."_".date("Y-m-d H:i:s");  
        $thanksCode = $this->requireToVar("thank_you/index.html");
        $thanksCode = str_replace("|====|", $_POST['name'], $thanksCode);
        $thanksCode = str_replace("|----|", $_POST['phone'], $thanksCode);
        $thanksCode = str_replace("|ORDER_ID|", $res['order_id'], $thanksCode);
        print $thanksCode;
        file_put_contents($file_name, print_r($res, TRUE)."\n".print_r($args, TRUE)."\n", FILE_APPEND);
    }

    public function sendLead() {
        $data = array(
            'api_key'       => $this->_api_key,
            'phone'         => $_POST['phone'],
            'name'          => $_POST['name'],
            'click_id'      => str_replace("as_", "", !empty($_POST['click_id'])?$_POST['click_id']:$_SESSION['binom_click_id']),
            'offer_id'      => $this->_offer_id,
            'aff_id'        => $this->_aff_id,
            'ip'            => $_SERVER['REMOTE_ADDR'],
            'sub1'          => $_POST['subid1'],
            'sub2'          => $_POST['subid2'],
            'sub3'          => $_POST['subid3'],
            'sub4'          => $_POST['subid4'],
            'sub5'          => $_POST['subid5'],
            
        );

        $curl = curl_init();
        curl_setopt_array($curl, array(
                                    CURLOPT_URL             => $this->_api_url,
                                    CURLOPT_RETURNTRANSFER  => true,
                                    CURLOPT_POST            => true,
                                    CURLOPT_SSL_VERIFYPEER  => false,
                                    CURLOPT_POSTFIELDS      => http_build_query($data),
                                    ));
        $res = curl_exec($curl);
        $res = json_decode($res, true);
        if ($res["status"] === "accepted") {
            $this->thanksPage($data);
        } else {
            print "ERROR";
        }
        curl_close($curl);
    }
}
$leadObj = new WhoCpaLead;
if (isset($_POST) && count($_POST) > 0) {
    $leadObj->sendLead();
} else {
    $leadObj->showLand();
}
?>