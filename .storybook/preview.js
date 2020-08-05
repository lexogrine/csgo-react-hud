import { addDecorator } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import "../src/index.css";
import "../src/HUD/Styles/info.css";
import "../src/HUD/Styles/killfeed.css";
import "../src/HUD/Styles/maps.css";
import "../src/HUD/Styles/match.css";
import "../src/HUD/Styles/matchbar.css";
import "../src/HUD/Styles/observed.css";
import "../src/HUD/Styles/overviews.css";
import "../src/HUD/Styles/players.css";
import "../src/HUD/Styles/series.css";
import "../src/HUD/Styles/sideboxes.css";
import "../src/HUD/Styles/trivia.css";
import "../src/HUD/Styles/storybook_overrides.css";

addDecorator(withKnobs);
