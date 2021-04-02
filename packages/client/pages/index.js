import { Page, Text, Button, Input, Spacer } from '@geist-ui/react'

export default function Home() {
  return (
    <Page dotBackdrop size="mini">
      <Page.Header>
        <Text h2>Metaverse Pool</Text>
      </Page.Header>
      <Text>
        Hello, I am using <Text b>Geist UI</Text>!
      </Text>
      <Input placeholder="Stacks address"></Input>
      <Spacer y={0.5}></Spacer>
      <Input placeholder="sats to add to pool"></Input>
      <Button>Action</Button>
      <Page.Footer>
        <Text small>this is a footer</Text>
      </Page.Footer>
    </Page>
  )
}
