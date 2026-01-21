import * as React from "react";
// import styles from './DbGenerator.module.scss';
import type { IDbGeneratorProps } from "./IDbGeneratorProps";
import { sp } from "@pnp/sp";
import { graph } from "@pnp/pnpjs";
import MainComponent from "./MainComponent";

export default class DbGenerator extends React.Component<
  IDbGeneratorProps,
  {}
> {
  constructor(prop: IDbGeneratorProps, state: {}) {
    super(prop);
    sp.setup({
      spfxContext: this.props.context as unknown as undefined,
    });

    graph.setup({
      spfxContext: this.props.context as unknown as undefined,
    });
  }

  public render(): React.ReactElement<IDbGeneratorProps> {
    return <MainComponent spfxContext={this.props.context} spContext={sp} />;
  }
}
