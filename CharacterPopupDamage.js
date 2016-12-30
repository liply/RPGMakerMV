//=============================================================================
// CharacterPopupDamage.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2016/12/31 ポップアップの色調設定機能を追加
//                  ポップアップの表示方法を詳細指定できる機能を追加
// 1.1.1 2016/09/15 最新の修正で自動ポップアップの設定が手動に影響していた問題を修正
// 1.1.0 2016/09/14 MPダメージ用に専用効果音を指定できる機能を追加
//                  HP、MP、TP、増加、減少の条件で個別に出力可否を設定できる機能を追加
// 1.0.3 2016/09/10 VE_BasicModule.jsとの競合を解消
// 1.0.2 2016/04/17 ポップアップ無効化のプラグインコマンドが機能していなかった問題を修正
// 1.0.1 2016/04/10 HPの増減との連動で増やすと減らすが逆に解釈されていたのを修正
// 1.0.0 2016/04/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc キャラクターのダメージポッププラグイン
 * @author トリアコンタン
 *
 * @param 効果音演奏
 * @desc 状況に応じたシステム効果音を自動演奏します。(ON/OFF)
 * @default ON
 *
 * @param X座標補正
 * @desc ポップアップ位置のX座標を補正します。
 * @default 0
 *
 * @param Y座標補正
 * @desc ポップアップ位置のY座標を補正します。
 * @default 0
 *
 * @param HP自動ポップアップ
 * @desc HPの増減を自動ポップアップの対象にします。(ON/OFF)
 * @default ON
 *
 * @param MP自動ポップアップ
 * @desc MPの増減を自動ポップアップの対象にします。(ON/OFF)
 * @default ON
 *
 * @param TP自動ポップアップ
 * @desc TPの増減を自動ポップアップの対象にします。(ON/OFF)
 * @default ON
 *
 * @param 増加自動ポップアップ
 * @desc パラメータの増加を自動ポップアップの対象にします。(ON/OFF)
 * @default ON
 *
 * @param 減少自動ポップアップ
 * @desc パラメータの減少を自動ポップアップの対象にします。(ON/OFF)
 * @default ON
 *
 * @param MPダメージ音
 * @desc MPダメージ時の効果音ファイル名を別途指定(audio/se)します。何も指定しないとHPと同じになります。
 * @default
 *
 * @param 回転
 * @desc 数字の回転運動を有効にします。以後の設定はこのパラメータがONのときのみ有効です。
 * @default ON
 *
 * @param X方向半径
 * @desc 数字を回転させる場合のX方向の半径です。
 * @default 40
 *
 * @param Y方向半径
 * @desc 数字を回転させる場合のY方向の半径です。
 * @default 40
 *
 * @param 回転速度
 * @desc 数字を回転させる場合の速度です。
 * @default 60
 *
 * @param 拡大率
 * @desc 初期状態の拡大率です。
 * @default 100
 *
 * @param 拡大率変化値
 * @desc 1フレームごとの拡大率の変化値です。
 * @default -10
 *
 * @help マップ画面でイベントやプレイヤーに数字をポップアップさせる機能を提供します。
 * マップ上でのダメージや回復の演出に利用できます。演出は戦闘時のものと同一です。
 * 指定する値をマイナスにすると回復扱いとなり色が変わります。
 * また、クリティカルにすると数字の色が一瞬、赤くなります。
 *
 * また「HPの増減」等のイベントコマンド実行時に自動で変化量をポップアップする機能や、
 * ダメージ床を通過した際に自動でポップアップする機能も用意されています。
 * パラメータにより、HPのみや増加のみといった条件指定もできます。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * ・CPD_DAMAGE or ポップアップダメージ [キャラクターID] [ダメージ値] [反転]
 * キャラクターを指定してダメージをポップアップします。
 * キャラクターの指定は以下の通りです。
 * -1   : プレイヤー
 *  0   : 実行中のイベント
 *  1.. : 指定したIDのイベント
 *
 * 反転を有効にすると、ポップアップの回転方向が逆になります。
 * （パラメータの「回転」を有効にしている場合）
 *
 * CPD_DAMAGE 5 -300 ON
 * ポップアップダメージ 0 \v[1] OFF
 *
 * ・CPD_CRITICAL or ポップアップクリティカル
 * キャラクターを指定してダメージをクリティカル扱いでポップアップします。
 *
 * CPD_CRITICAL -1 100 ON
 * ポップアップクリティカル 3 \v[1] OFF
 *
 * ・CPD_MP_DAMAGE or ポップアップMPダメージ
 * キャラクターを指定してMPダメージをポップアップします。
 *
 * CPD_MP_DAMAGE 5 -300 ON
 * ポップアップMPダメージ 0 \v[1] OFF
 *
 * ・CPD_MP_CRITICAL or ポップアップMPクリティカル
 * キャラクターを指定してMPダメージをクリティカル扱いでポップアップします。
 *
 * CPD_MP_CRITICAL -1 100 ON
 * ポップアップMPクリティカル 3 \v[1] OFF
 *
 * ・CPD_MISS or ポップアップミス
 * キャラクターを指定してmissをポップアップします。
 *
 * CPD_MISS -1 ON
 * ポップアップミス 3 OFF
 *
 * ・CPD_INVALID or ポップアップ無効化
 * 自動ポップアップを無効にします。
 * 有効になっているとイベントコマンド「HPの増減」「MPの増減」「TPの増減」
 * およびダメージ床によるダメージが自動でポップアップします。
 * 初期状態では有効です。
 *
 * ・CPD_VALID or ポップアップ有効化
 * 自動ポップアップを再度有効にします。
 *
 * ・CPD_SETTING_TONE or ポップアップ設定_色調 [赤] [緑] [青] [グレー]
 * ポップアップ画像の色調を変更できます。色調の設定値を順番に指定してください。
 *
 * CPD_SETTING_TONE 255 0 0 255
 * ポップアップ設定_色調 -255 -255 -255 0
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    const pluginName = 'CharacterPopupDamage';
    const settings   = {
        /* MPダメージ専用効果音(ファイル名はパラメータで指定) */
        mpDamageSe: {
            volume: 90,
            pitch : 100,
            pan   : 0
        }
    };

    const getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    const getParamBoolean = function(paramNames) {
        const value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    const getParamNumber = function(paramNames, min, max) {
        const value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    const getParamString = function(paramNames) {
        const value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    const getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (let i = 0; i < paramNames.length; i++) {
            const name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    const getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharactersAndEval(arg, true), 10) || 0).clamp(min, max);
    };

    const getArgBoolean = function(arg) {
        return (arg || '').toUpperCase() === 'ON';
    };

    const convertEscapeCharactersAndEval = function(text, evalFlg) {
        if (text === null || text === undefined) text = '';
        const window = SceneManager._scene._windowLayer.children[0];
        if (window) {
            const result = window.convertEscapeCharacters(text);
            return evalFlg ? eval(result) : result;
        } else {
            return text;
        }
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    const paramPlaySe          = getParamBoolean(['PlaySe', '効果音演奏']);
    const paramOffsetX         = getParamNumber(['OffsetX', 'X座標補正']);
    const paramOffsetY         = getParamNumber(['OffsetY', 'Y座標補正']);
    const paramTpAutoPop       = getParamBoolean(['TPAutoPop', 'TP自動ポップアップ']);
    const paramMpAutoPop       = getParamBoolean(['MPAutoPop', 'MP自動ポップアップ']);
    const paramHpAutoPop       = getParamBoolean(['HPAutoPop', 'HP自動ポップアップ']);
    const paramIncreaseAutoPop = getParamBoolean(['IncreaseAutoPop', '増加自動ポップアップ']);
    const paramDecreaseAutoPop = getParamBoolean(['DecreaseAutoPop', '減少自動ポップアップ']);
    const paramMpDamageSe      = getParamString(['MPDamageSe', 'MPダメージ音']);
    const paramRotation        = getParamBoolean(['Rotation', '回転']);
    const paramRadiusX         = getParamNumber(['RadiusX', 'X方向半径']);
    const paramRadiusY         = getParamNumber(['RadiusY', 'Y方向半径']);
    const paramRotateSpeed     = getParamNumber(['RotateSpeed', '回転速度']);
    const paramScale           = getParamNumber(['Scale', '拡大率']);
    const paramScaleDelta      = getParamNumber(['ScaleDelta', '拡大率変化値']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    const _Game_Interpreter_pluginCommand    = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandCharacterPopupDamage(command, args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                const window = require('nw.gui').Window.get();
                if (!window.isDevToolsOpen()) {
                    const devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(Graphics.width, Graphics.height);
                    window.focus();
                }
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandCharacterPopupDamage = function(command, args) {
        let popupArgs = [];
        switch (getCommandName(command)) {
            case 'CPD_DAMAGE' :
            case 'ポップアップダメージ':
                popupArgs = [getArgNumber(args[1]), false, getArgBoolean(args[2])];
                this.callCharacterPopup(args, 'popupDamage', popupArgs);
                break;
            case 'CPD_CRITICAL' :
            case 'ポップアップクリティカル':
                popupArgs = [getArgNumber(args[1]), true, getArgBoolean(args[2])];
                this.callCharacterPopup(args, 'popupDamage', popupArgs);
                break;
            case 'CPD_MP_DAMAGE' :
            case 'ポップアップMPダメージ':
                popupArgs = [getArgNumber(args[1]), false, getArgBoolean(args[2])];
                this.callCharacterPopup(args, 'popupMpDamage', popupArgs);
                break;
            case 'CPD_MP_CRITICAL' :
            case 'ポップアップMPクリティカル':
                popupArgs = [getArgNumber(args[1]), true, getArgBoolean(args[2])];
                this.callCharacterPopup(args, 'popupMpDamage', popupArgs);
                break;
            case 'CPD_MISS' :
            case 'ポップアップミス':
                popupArgs = [getArgBoolean(args[1])];
                this.callCharacterPopup(args, 'popupMiss', popupArgs);
                break;
            case 'CPD_VALID' :
            case 'ポップアップ有効化':
                $gameSystem.setSuppressAutoPopup(false);
                break;
            case 'CPD_INVALID' :
            case 'ポップアップ無効化':
                $gameSystem.setSuppressAutoPopup(true);
                break;
            case 'CPD_SETTING_TONE' :
            case 'ポップアップ設定_色調':
                var red   = getArgNumber(args[0]);
                var green = getArgNumber(args[1]);
                var blue  = getArgNumber(args[2]);
                var gray  = getArgNumber(args[3]);
                $gameSystem.setPopupDamageTone([red, green, blue, gray]);
                break;
        }
    };

    const _Game_Interpreter_command311    = Game_Interpreter.prototype.command311;
    Game_Interpreter.prototype.command311 = function() {
        const value = -this.operateValue(this._params[2], this._params[3], this._params[4]);
        if ($gameSystem.isNeedAutoHpPopup(value)) {
            $gamePlayer.popupDamage(value, false);
        }
        return _Game_Interpreter_command311.apply(this, arguments);
    };

    const _Game_Interpreter_command312    = Game_Interpreter.prototype.command312;
    Game_Interpreter.prototype.command312 = function() {
        const value = -this.operateValue(this._params[2], this._params[3], this._params[4]);
        if ($gameSystem.isNeedAutoMpPopup(value)) {
            $gamePlayer.popupMpDamage(value, false);
        }
        return _Game_Interpreter_command312.apply(this, arguments);
    };

    const _Game_Interpreter_command326    = Game_Interpreter.prototype.command326;
    Game_Interpreter.prototype.command326 = function() {
        const value = -this.operateValue(this._params[2], this._params[3], this._params[4]);
        if ($gameSystem.isNeedAutoTpPopup(value)) {
            $gamePlayer.popupDamage(value, false);
        }
        return _Game_Interpreter_command326.apply(this, arguments);
    };

    Game_Interpreter.prototype.callCharacterPopup = function(args, methodName, extend) {
        const character = this.character(getArgNumber(args[0], -1));
        if (character) character[methodName].apply(character, extend);
    };

    //=============================================================================
    // Game_Actor
    //  ダメージ床によるポップアップを処理します。
    //=============================================================================
    const _Game_Actor_executeFloorDamage    = Game_Actor.prototype.executeFloorDamage;
    Game_Actor.prototype.executeFloorDamage = function() {
        const prevHp = this.hp;
        const prevMp = this.mp;
        const prevTp = this.tp;
        _Game_Actor_executeFloorDamage.apply(this, arguments);
        if (this === $gameParty.members()[0]) {
            const hpDamage = prevHp - this.hp;
            if (hpDamage !== 0 && $gameSystem.isNeedAutoHpPopup(hpDamage)) $gamePlayer.popupDamage(hpDamage, false);
            const mpDamage = prevMp - this.mp;
            if (mpDamage !== 0 && $gameSystem.isNeedAutoMpPopup(mpDamage)) $gamePlayer.popupMpDamage(mpDamage, false);
            const tpDamage = prevTp - this.tp;
            if (tpDamage !== 0 && $gameSystem.isNeedAutoTpPopup(tpDamage)) $gamePlayer.popupDamage(tpDamage, false);
        }
    };

    //=============================================================================
    // Game_System
    //  オートポップアップの有効フラグを追加定義します。
    //=============================================================================
    const _Game_System_initialize    = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this._suppressAutoPopup = false;
        this._popupDamageTone   = null;
    };

    Game_System.prototype.setSuppressAutoPopup = function(value) {
        this._suppressAutoPopup = !!value;
    };

    Game_System.prototype.isSuppressAutoPopup = function() {
        return this._suppressAutoPopup;
    };

    Game_System.prototype.isNeedAutoHpPopup = function(value) {
        return paramHpAutoPop && this.isNeedAutoPopup(value);
    };

    Game_System.prototype.isNeedAutoMpPopup = function(value) {
        return paramMpAutoPop && this.isNeedAutoPopup(value);
    };

    Game_System.prototype.isNeedAutoTpPopup = function(value) {
        return paramTpAutoPop && this.isNeedAutoPopup(value);
    };

    Game_System.prototype.isNeedAutoPopup = function(value) {
        return !$gameSystem.isSuppressAutoPopup() &&
            ((paramIncreaseAutoPop && value < 0) || (paramDecreaseAutoPop && value > 0));
    };

    Game_System.prototype.getPopupDamageTone = function() {
        return this._popupDamageTone;
    };

    Game_System.prototype.setPopupDamageTone = function(value) {
        this._popupDamageTone = value;
    };

    //=============================================================================
    // Game_CharacterBase
    //  ダメージ情報を保持します。
    //=============================================================================
    Game_CharacterBase.prototype.popupDamage = function(value, critical, mirror) {
        this.startDamagePopup(value, critical, false, mirror);
    };

    Game_CharacterBase.prototype.popupMpDamage = function(value, critical, mirror) {
        this.startDamagePopup(value, critical, true, mirror);
    };

    Game_CharacterBase.prototype.popupMiss = function(mirror) {
        this.startDamagePopup(null, false, mirror);
    };

    Game_CharacterBase.prototype.isDamagePopupRequested = function() {
        return this._damagePopup;
    };

    Game_CharacterBase.prototype.clearDamagePopup = function() {
        if (!this._damageInfo || this._damageInfo.length === 0) {
            this._damagePopup = false;
        }
    };

    Game_CharacterBase.prototype.startDamagePopup = function(value, critical, mpFlg, mirror) {
        this._damagePopup = true;
        if (!this._damageInfo) this._damageInfo = [];
        const damageInfo = {value: value, critical: critical, mpFlg: mpFlg, mirror: mirror};
        if (paramPlaySe) this.playPopupSe(damageInfo);
        this._damageInfo.push(damageInfo);
    };

    Game_CharacterBase.prototype.playPopupSe = function(damageInfo) {
        if (damageInfo.value === null) {
            SoundManager.playMiss();
        } else if (damageInfo.value < 0) {
            SoundManager.playRecovery();
        } else if (damageInfo.mpFlg && paramMpDamageSe) {
            settings.mpDamageSe.name = paramMpDamageSe;
            AudioManager.playStaticSe(settings.mpDamageSe);
        } else if (this === $gamePlayer) {
            SoundManager.playActorDamage();
        } else {
            SoundManager.playEnemyDamage();
        }
    };

    Game_CharacterBase.prototype.shiftDamageInfo = function() {
        return this._damageInfo ? this._damageInfo.shift() : null;
    };

    //=============================================================================
    // Sprite_Character
    //  ダメージをポップアップします。
    //=============================================================================
    const _Sprite_Character_update    = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.apply(this, arguments);
        this.updateDamagePopup();
    };

    Sprite_Character.prototype.updateDamagePopup = function() {
        this.setupDamagePopup();
        if (this._damages && this._damages.length > 0) {
            for (let i = 0; i < this._damages.length; i++) {
                this._damages[i].update();
            }
            if (!this._damages[0].isPlaying()) {
                this.parent.removeChild(this._damages[0]);
                this._damages.shift();
            }
        }
    };

    Sprite_Character.prototype.setupDamagePopup = function() {
        if (this._character.isDamagePopupRequested()) {
            const sprite = new Sprite_CharacterDamage();
            sprite.x     = this.x + this.damageOffsetX();
            sprite.y     = this.y + this.damageOffsetY();
            if (!sprite.z) sprite.z = 9;
            sprite.setupCharacter(this._character);
            if (!this._damages) this._damages = [];
            this._damages.push(sprite);
            this.parent.addChild(sprite);
            this._character.clearDamagePopup();
        }
    };

    Sprite_Character.prototype.damageOffsetX = function() {
        return paramOffsetX;
    };

    Sprite_Character.prototype.damageOffsetY = function() {
        return paramOffsetY;
    };

    //=============================================================================
    // Sprite_CharacterDamage
    //  ダメージ情報を受け取ってセットアップします。
    //=============================================================================
    function Sprite_CharacterDamage() {
        this.initialize.apply(this, arguments);
    }

    Sprite_CharacterDamage.prototype             = Object.create(Sprite_Damage.prototype);
    Sprite_CharacterDamage.prototype.constructor = Sprite_CharacterDamage;

    Sprite_CharacterDamage.prototype.setupCharacter = function(character) {
        const damageInfo = character.shiftDamageInfo();
        this._toneColor  = $gameSystem.getPopupDamageTone();
        this._mirror     = damageInfo.mirror;
        this._digit      = 0;
        if (damageInfo.value === null) {
            this.createMissForCharacter();
        } else {
            this.createDigits(damageInfo.mpFlg ? 2 : 0, damageInfo.value);
        }
        if (damageInfo.critical) {
            this.setupCriticalEffect();
        }

    };

    Sprite_CharacterDamage.prototype.createMissForCharacter = function() {
        const w      = this.digitWidth();
        const h      = this.digitHeight();
        const sprite = this.createChildSprite();
        sprite.setFrame(0, 4 * h, 4 * w, h);
        sprite.dy = 0;
        sprite.x  = w / 2;
        sprite.digit++;
        this._digit++;
    };

    Sprite_CharacterDamage.prototype.createChildSprite = function() {
        const sprite = Sprite_Damage.prototype.createChildSprite.apply(this, arguments);
        sprite.frame = 0;
        sprite.digit = this._digit++;
        if (this._toneColor) sprite.setColorTone(this._toneColor);
        return sprite;
    };

    Sprite_CharacterDamage.prototype.updateChild = function(sprite) {
        if (paramRotation) {
            this.updateChildRotation(sprite);
        } else {
            Sprite_Damage.prototype.updateChild.apply(this, arguments);
        }
    };

    Sprite_CharacterDamage.prototype.updateChildRotation = function(sprite) {
        const frame = sprite.frame++;
        const speed = frame / 3600 * paramRotateSpeed;
        sprite.rx   = paramRadiusX * (Math.cos(speed) - 1);
        sprite.ry   = -paramRadiusY * Math.sin(speed);
        if (this._mirror) {
            sprite.rx *= -1;
        }
        sprite.x       = Math.round(sprite.rx);
        sprite.y       = Math.round(sprite.ry);
        const scale    = (paramScale + frame * paramScaleDelta / 10) / 100;
        sprite.scale.x = scale;
        sprite.scale.y = scale;
        sprite.x += (sprite.digit - (this._digit - 1) / 2) * (this.digitWidth() * scale);
        sprite.setBlendColor(this._flashColor);
    };
})();

