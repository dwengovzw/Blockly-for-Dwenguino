/**
 * @license
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Dwenguino blocks for Blockly.
 * @author Tom.Neutens@UGent.be
 */
'use strict';

goog.provide('Blockly.Blocks.comments');

goog.require('Blockly.Blocks');

Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
    // Block for text value
    {
      "type": "line_comment",
      "message0": "// %1",
      "args0": [{
        "type": "field_input",
        "name": "TEXT",
        "text": ""
      }],
      "colour": Blockly.Msg.COMMENTS_HUE,
      "previousStatement": null,
      "nextStatement": null,
      "helpUrl": "",
      "tooltip": "",
    },
]);