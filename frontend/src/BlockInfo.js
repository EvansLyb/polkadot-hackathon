import React, { useEffect, useState } from 'react';
import { Table, Grid, Button, Form, Input, Label } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSubstrate } from './substrate-lib';

function Main (props) {
  const { api } = useSubstrate();
  const [blockInfo, setBlockInfo] = useState();
  const [searchingBlockInfo, setSearchingBlockInfo] = useState(false);
  const [searchedBlockInfo, setSearchedBlockInfo] = useState();
  const [subscribeInitialized, setSubscribeInitialized] = useState(false);
  const initFormState = {
    searchingType: 'Number',
    searchingData: ''
  };
  const [formState, setFormState] = useState(initFormState);
  const searchingTypes = [{
    key: 'Number',
    value: 'Number',
    text: 'Number'
  }, {
    key: 'Hash',
    value: 'Hash',
    text: 'Hash'
  }];

  // subscribeNewHeads
  useEffect(() => {
    const subscribeNewBlockInfo = async () => {
      try {
        await api.rpc.chain.subscribeNewHeads((header) => {
          setBlockInfo(header);
        });
      } catch (e) {
        console.log(e);
      }
    }
    subscribeNewBlockInfo().catch(console.error);
  }, [subscribeInitialized]);

  // Searching
  const onChange = (_, data) => {
    setFormState(prev => ({ ...prev, [data.state]: data.value }));
  }

  const onSearch = async (_, data) => {
    const { searchingType, searchingData } = formState;
    let blockInfo
    if (searchingType == 'Hash') {
      blockInfo = await api.rpc.chain.getHeader(searchingData);
    } else {
      // query block hash from block number
      const blockHash = await api.query.system.blockHash(searchingData);
      blockInfo = await api.rpc.chain.getHeader(blockHash);
    }
    if (blockInfo && blockInfo.number) {
      setSearchedBlockInfo(blockInfo);
    } else {
      setSearchedBlockInfo(null);
    }
    setSearchingBlockInfo(true);
  }

  const displayLatestBlockInfo = (_, data) => {
    setSearchingBlockInfo(false);
  }

  const { searchingType, searchingData } = formState;

  return (
    <Grid.Column>
      <h1>Block Info</h1>
      <Form onSubmit={onSearch} size='large'>
        <Form.Group inline widths={16}>
          <Form.Field width={2}>
            <Label
              size='big'
              style={{
                background: 'transparent',
                fontWeight: 'bold',
                padding: '0',
                color: '#000'
              }}
            >Find a block: </Label>
          </Form.Field>
          <Form.Field width={3} inline>
            <Label size='big' pointing='right'>Type</Label>
            <Form.Select
              fluid
              onChange={onChange}
              state='searchingType'
              value={searchingType}
              options={searchingTypes}
            ></Form.Select>
          </Form.Field>
          <Form.Field width={9} inline>
            <Label size='big' pointing='right'>Number/Hash</Label>
            <Input
              fluid
              type='text'
              state='searchingData'
              value={searchingData}
              onChange={onChange}
            ></Input>
          </Form.Field>
          <Form.Field style={{ textAlign: 'center' }} width={1}>
            <Button
              size='big'
              basic
              color='blue'
              type='submit'
            >Search</Button>
          </Form.Field>
        </Form.Group>
      </Form>
      <Button
        size='big'
        basic
        color='pink'
        onClick={displayLatestBlockInfo}
      >Display Latest Block Info</Button>
      {((!searchingBlockInfo && blockInfo) || (searchingBlockInfo && searchedBlockInfo)) && (
        <Table celled striped>
          {/* <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Label</Table.HeaderCell>
              <Table.HeaderCell>Data</Table.HeaderCell>
            </Table.Row>
          </Table.Header> */}
          <Table.Body>
            <Table.Row>
              <Table.Cell width={3} textAlign='right'>Block Number</Table.Cell>
              <Table.Cell width={13}>{searchingBlockInfo ? searchedBlockInfo.number.toNumber() : blockInfo.number.toNumber()}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell width={3} textAlign='right'>Block Hash</Table.Cell>
              <Table.Cell width={13}>
                <span style={{ display: 'inline-block', minWidth: '38em' }}>
                  {searchingBlockInfo ? searchedBlockInfo.hash.toHuman() : blockInfo.hash.toHuman()}
                </span>
                <CopyToClipboard text={searchingBlockInfo ? searchedBlockInfo.hash.toHuman() : blockInfo.hash.toHuman()}>
                  <Button
                    basic
                    circular
                    compact
                    size='mini'
                    color='blue'
                    icon='copy outline'
                  />
                </CopyToClipboard>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell width={3} textAlign='right'>Parent Hash</Table.Cell>
              <Table.Cell width={13}>
                <span style={{ display: 'inline-block', minWidth: '38em' }}>
                  {searchingBlockInfo ? searchedBlockInfo.parentHash.toHuman() : blockInfo.parentHash.toHuman()}
                </span>
                <CopyToClipboard text={searchingBlockInfo ? searchedBlockInfo.parentHash.toHuman() : blockInfo.parentHash.toHuman()}>
                  <Button
                    basic
                    circular
                    compact
                    size='mini'
                    color='blue'
                    icon='copy outline'
                  />
                </CopyToClipboard>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell width={3} textAlign='right'>State Root</Table.Cell>
              <Table.Cell width={13}>
                <span style={{ display: 'inline-block', minWidth: '38em' }}>
                  {searchingBlockInfo ? searchedBlockInfo.stateRoot.toHuman() : blockInfo.stateRoot.toHuman()}
                </span>
                <CopyToClipboard text={searchingBlockInfo ? searchedBlockInfo.stateRoot.toHuman() : blockInfo.stateRoot.toHuman()}>
                  <Button
                    basic
                    circular
                    compact
                    size='mini'
                    color='blue'
                    icon='copy outline'
                  />
                </CopyToClipboard>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell width={3} textAlign='right'>Extrinsics Root</Table.Cell>
              <Table.Cell width={13}>
                <span style={{ display: 'inline-block', minWidth: '38em' }}>
                  {searchingBlockInfo ? searchedBlockInfo.extrinsicsRoot.toHuman() : blockInfo.extrinsicsRoot.toHuman()}
                </span>
                <CopyToClipboard text={searchingBlockInfo ? searchedBlockInfo.extrinsicsRoot.toHuman() : blockInfo.extrinsicsRoot.toHuman()}>
                  <Button
                    basic
                    circular
                    compact
                    size='mini'
                    color='blue'
                    icon='copy outline'
                  />
                </CopyToClipboard>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      )}
    </Grid.Column>
  );
}

export default function BlockInfo (props) {
  const { api } = useSubstrate();
  return api.rpc &&
    api.rpc.chain &&
    api.rpc.chain.subscribeNewHeads ? (
      <Main {...props} />
    ) : null;
}