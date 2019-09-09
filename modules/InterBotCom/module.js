"use strict";

// @IMPORTS
const Application = require("../../lib/Application");
const Module = require("../../lib/Module");
const Promise = require("bluebird");
const Tools = require("../../lib/Tools");
var canni_id;
var wachmann_id;

module.exports = class InterBotCom extends Module {
    start() {
        return new Promise((resolve, reject) => {
            this.log.debug("Starting...");

            if (Tools.test_ENV("CANNI_ID")) {
                canni_id = process.env.CANNI_ID;
                wachmann_id = Application.getClientId();
            }

            Application.modules.Discord.client.on('message', (msg) => {
                if (msg.author.bot) {
                    if (msg.author.id === canni_id) {
                        return this.check_canni_interaction(msg);
                    }
                }
            });

            return resolve(this);
        });
    }

    check_canni_interaction(msg) {
        if (msg.isMemberMentioned(Application.getClient().user)) {
            if (Tools.msg_contains(msg,"boops")) {
                setTimeout(function () {
                    msg.channel.send(Tools.parseReply(this.config.ans_boop_guard, [msg.author]));
                }.bind(this), 2000);
            }
            if (Tools.msg_contains(msg, "baps")) {
                setTimeout(function () {
                    msg.channel.send(Tools.parseReply(this.config.bapGuardAnswer, [msg.author]));
                }.bind(this), 2000);
            }
        }
    }

    stop() {
        return new Promise((resolve, reject) => {
            this.log.debug("Stopping...");
            return resolve(this);
        })
    }
};
