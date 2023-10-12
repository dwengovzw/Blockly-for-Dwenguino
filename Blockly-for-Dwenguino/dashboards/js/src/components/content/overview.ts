import { CSSResultGroup, LitElement, css, html } from 'lit';
import { connect } from 'pwa-helpers';
import { store } from '../../state/store';
import { customElement, property, state } from "lit/decorators.js"; 
import { LearningPath } from '../../state/features/content_slice';
import { getLocale } from '../../localization/localization';

interface RootState {
    // Define the state properties you want to use in the component
}

@customElement('dwengo-content-overview')
class Overview extends connect(store)(LitElement) {

    currentColorIndex: number = 0;
    dwengoColors: string[] = ["#0f5faa", "#0f5d6d", "#115b4e", "#115933", "#3c8227", "#73b51e", "#f4a72c", "#e87b66"];

    @property({type: Object})
    learningPaths: LearningPath[] = store.getState().content.learningPaths

    render() {
        return html`
            <div class="content_container">
                ${this.learningPaths.map((learningPath: LearningPath) => {
                    return html`
                    <div class="learning_path_card">
                        <a href="${globalSettings.hostname}/dashboard/learningpath/${learningPath.hruid}/${learningPath.language}" style="text-decoration: none;">
                            <div class="card_content">
                                <img class="card-img-top" src="data:image/jpeg;base64, ${learningPath.image}" 
                                    width="500" 
                                    height="500" 
                                    style="filter: grayscale(100%);">
                                <div class="card-body-container">
                                    <div class="card-body" style="background-color: ${this.dwengoColors[this.currentColorIndex++ % this.dwengoColors.length]}; color: white;">
                                        <h5 class="card-title">${learningPath.title}</h5>
                                        <p class="card-text">${learningPath.description}</p>
                                    </div>
                                </div>
                                <span class="age_group_label">
                                    <img class="age_range_icon" width="100" height="75" src="${globalSettings.hostname}/dashboard/assets/img/components/shared/age_logo.svg">
                                    <span class="age_range_text">${learningPath.min_age} - ${learningPath.max_age}</span>
                                </span>
                            </div>
                            </a>
                        </div>
                    `
                })}
            </div>
        `
    }
    static styles?: CSSResultGroup = css`
        
        .content_container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            margin: 0 0rem;
            box-sizing: border-box;
        }

        .learning_path_card {
            padding-bottom: 1rem;
            padding-top: 1rem;
            flex: 0 0 25%;
            max-width: 25%;
            position: relative;
            width: 100%;
            min-height: 1px;
            padding-right: 15px;
            padding-left: 15px;
            box-sizing: border-box;
        }

        .card_content {
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            min-width: 0;
            word-wrap: break-word;
            background-color: white;
            background-clip: border-box;
            border: 1px solid rgba(0,0,0,.125);
            border-radius: .25rem;
            box-sizing: border-box;

        }

        .card-img-top {
            filter: grayscale(100%);
            position: relative;
            top: 0;
            width: 100%;
            border-top-left-radius: calc(.25rem - 1px);
            border-top-right-radius: calc(.25rem - 1px);
            vertical-align: middle;
            border-style: none;
            max-width: 100%;
            height: auto;
            box-sizing: border-box;
            aspect-ratio: auto 500 / 500;
            overflow-clip-margin: content-box;
            overflow: clip;
            word-wrap: break-word;
        }

        .card-body-container {
            overflow: hidden;
            position: relative;
            padding-top: 100%;
            border-bottom-left-radius: .25rem;
            border-bottom-right-radius: .25rem;
            box-sizing: border-box;
            display: block;
            word-wrap: break-word;
        }
        .age_group_label {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            width: 55px;
            height: 55px;
            display: grid;
            place-content: center;
            place-items: center;
            background-color: white;
            border: solid #e87b66 6px;
            color: #e87b66;
            font-weight: bold;
            font-size: 0.7em;
            border-radius: 0.25rem;
            box-sizing: border-box;
        }
        .card-body {
            padding: 15px;
            font-size: 1rem;
            overflow: hidden;
            text-overflow: ellipsis;
            border: 0;
            left: 0;
            top: 0;
            position: absolute;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            flex: 1 1 auto;
        }
        .age_range_icon {
            padding: 0.25rem 0.5rem 0 0.5rem;
            color: #e87b66;
            fill: #e87b66;
            vertical-align: middle;
            border-style: none;
            max-width: 100%;
            height: auto;
            box-sizing: border-box;
            aspect-ratio: auto 100 / 75;
            overflow-clip-margin: content-box;
            overflow: clip;
        }

        @media (max-width: 1200px) {
            .learning_path_card {
                flex-basis: 33.33%;
                max-width: 33.33%;
            }
        }

        @media (max-width: 992px) {
            .learning_path_card {
                flex-basis: 50%;
                max-width: 50%;
            }
        }

        @media (max-width: 768px) {
            .learning_path_card {
                flex-basis: 100%;
                max-width: 100%;
            }
        }
`
}
