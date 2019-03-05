import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { inject as service } from '@ember-decorators/service';
import { readOnly } from '@ember-decorators/object/computed';

@tagName('')
export default class CanvasTools extends Component {
  @service canvasTools;
  @readOnly('canvasTools.tools') tools;
  @readOnly('canvasTools.selectedTool') selectedTool;

  @action
  chooseTool(tool) {
    this.canvasTools.chooseTool(tool);
  }
}
