<?php
// must be run within Dokuwiki
if(!defined('DOKU_INC')) die();

class syntax_plugin_bingo extends DokuWiki_Syntax_Plugin {

    // only include assets once
    protected static $assets_included = false;

    public function getType() { return 'substition'; }
    public function getPType() { return 'block'; }
    public function getSort() { return 100; }

    public function connectTo($mode) {
        // <bingo words="a,b,c,..." size="3" />
        $this->Lexer->addSpecialPattern('<bingo\b.*?\/>', $mode, 'plugin_bingo');
    }

    public function handle($match, $state, $pos, Doku_Handler $handler){
        // parse attributes
        $attr = array();
        // extract attribute pairs key="value"
        if(preg_match_all('/([a-zA-Z_]+)\s*=\s*"([^"]*)"/', $match, $m, PREG_SET_ORDER)){
            foreach($m as $pair){
                $attr[strtolower($pair[1])] = $pair[2];
            }
        }
        // words attribute as comma separated
        $words_raw = isset($attr['words']) ? $attr['words'] : '';
        $words = array_map('trim', explode(',', $words_raw));
        // filter empty entries
        $words = array_values(array_filter($words, function($w){ return $w !== ''; }));

        // size (default 3)
        $size = isset($attr['size']) ? intval($attr['size']) : 3;
        if($size !== 3 && $size !== 4) $size = 3;

        return array(
            'words' => $words,
            'size'  => $size
        );
    }

    public function render($mode, Doku_Renderer $renderer, $data) {
        if($mode !== 'xhtml') return false;

        $words = $data['words'];
        $size = $data['size'];
        $expected = $size * $size;

        // include assets once
        if(!self::$assets_included){
            $base = DOKU_BASE . 'lib/plugins/bingo/';
            $renderer->doc .= '<link rel="stylesheet" href="' . $base . 'css/bingo.css" />'."\n";
            $renderer->doc .= '<script src="' . $base . 'js/bingo.js"></script>'."\n";
            self::$assets_included = true;
        }

        // unique container id so multiple instances can exist
        static $id = 0;
        $id++;
        $containerId = "bingo_board_{$id}";
        $scoreId     = "bingo_score_{$id}";

        if(count($words) !== $expected){
            $renderer->doc .= '<div class="bingo-error">Bitte genau ' . $expected . ' Wörter angeben (size=' . $size . ').</div>';
            return true;
        }

        // render container HTML
        $renderer->doc .= '<div class="bingo-container">' . "\n";
        $renderer->doc .= '<div id="'.htmlspecialchars($scoreId).'" class="bingo-score">Punkte: 0</div>' . "\n";
        $renderer->doc .= '<div id="'.htmlspecialchars($containerId).'" class="bingo-board"></div>' . "\n";
        $renderer->doc .= '</div>' . "\n";

        // Pass config for this instance by inlining a JSON object and calling init
        $baseUrl = DOKU_BASE . 'lib/plugins/bingo/';
        $soundUrl = $baseUrl . 'sounds/bingo.mp3'; // ensure file exists

        // prepare JSON-safe words (escape)
        $json = json_encode(array(
            'words' => $words,
            'size'  => $size,
            'sound' => $soundUrl,
            'containerId' => $containerId,
            'scoreId' => $scoreId
        ));

        $renderer->doc .= "<script>if(window.initBingo) { initBingo($json); } else { document.addEventListener('DOMContentLoaded', function(){ if(window.initBingo) initBingo($json); }); }</script>\n";

        return true;
    }
}
