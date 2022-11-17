import "../../scss/index.scss"
import "./components/name_tag.ts"
import { 
    fastButton, 
    fastMenu,
    provideFASTDesignSystem 
} from "@microsoft/fast-components";
provideFASTDesignSystem().register(
    fastButton(),
    fastMenu()
);

