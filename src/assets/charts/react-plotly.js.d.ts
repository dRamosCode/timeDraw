// src/react-plotly.js.d.ts
declare module "react-plotly.js" {
  import { Component } from "react";
  import { Layout, Data, Config } from "plotly.js";

  interface PlotProps {
    data: Partial<Data>[];
    layout?: Partial<Layout>;
    config?: Partial<Config>;
    onClick?: (event: any) => void;
    onRelayout?: (event: any) => void;
    onInitialized?: (figure: any) => void;
    onUpdate?: (figure: any) => void;
    style?: React.CSSProperties;
  }

  export default class Plot extends Component<PlotProps> {}
}
