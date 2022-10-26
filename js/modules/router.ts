import { move } from "../util/move";
import { Dir } from "../constants";

switch (window.location.hash) {
  case "#blog":
    move(Dir.Up);
    break;

  case "#contact":
    move(Dir.Down);
    break;

  case "#gfx":
    move(Dir.Left);
    break;

  case "#dev":
    move(Dir.Right);
    break;
}