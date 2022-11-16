import { FASTElement, customElement, attr, ValueConverter, html, ViewTemplate } from '@microsoft/fast-element';


const numberConverter: ValueConverter = {
    toView(value: number): string {
        return value.toString();
    },
  
    fromView(value: string): number {
      if (Number.isNaN(Number(value))){
        return 1
      } else {
        return Number(value);
      }
    }
  };

const template: ViewTemplate<NameTag> = html`
  <div class="header">
    <h3>${x => x.greeting.toUpperCase()}</h3>
    <h4>my name is</h4>
  </div>

  <div class="body">${name_tag => name_tag.numberOfGreets }</div>
  <button @click="${x => x.handleButtonClick()}">Greet</button>

  <div class="footer"></div>
`;

@customElement({
  name: 'name-tag',
  template
})
export class NameTag extends FASTElement {
    @attr greeting: string = 'Hello';
    @attr({ converter: numberConverter }) numberOfGreets: number = 2;

    handleButtonClick() {
      this.numberOfGreetsChanged(this.numberOfGreets, this.numberOfGreets + 1);
    }

    connectedCallback() {
        super.connectedCallback();
        console.log("name-tag is now connected to the DOM");
    }

    // optional method 
    greetingChanged() {
        console.log(this.greeting)
        this.shadowRoot!.innerHTML = this.greeting;
    }

    numberOfGreetsChanged(oldValue: number, newValue: number){
      this.numberOfGreets = newValue
        console.log(this.numberOfGreets);
    }
}