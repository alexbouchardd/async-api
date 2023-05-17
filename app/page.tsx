import { retrieveConnections } from "@/services/hookdeck";
import * as asyncApi from "@/services/asyncapi";
import HomeScreen from "./HomeScreen";

export default async function Home() {
  const connections = await retrieveConnections();

  const initStatus = await asyncApi.getStatus();

  if (initStatus === "uninitialized") {
    await asyncApi.init();
  }

  return <HomeScreen connections={connections} />;
}
