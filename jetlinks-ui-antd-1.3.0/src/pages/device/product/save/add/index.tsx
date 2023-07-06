import React, {useEffect, useState} from 'react';
import {FormComponentProps} from 'antd/lib/form';
import Form from 'antd/es/form';
import {Avatar, Button, Card, Cascader, Col, Input, message, Radio, Row, Select, Spin, TreeSelect, Upload} from 'antd';
import {DeviceProduct} from '../../data';
import {FormItemConfig} from '@/utils/common';
import apis from '@/services';
import styles from "@/pages/device/product/save/add/index.less";
import productImg from "@/pages/device/product/img/product.png";
import {UploadProps} from "antd/lib/upload";
import {getAccessToken} from "@/utils/authority";
import {UploadOutlined} from "@ant-design/icons/lib";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import Classified from '@/pages/device/product/save/add/classified';
import {ProtocolItem} from "@/pages/device/protocol/data";
import {router} from "umi";

interface Props extends FormComponentProps {
  data?: Partial<DeviceProduct>;
  close: Function;
  save: (data: Partial<DeviceProduct>) => void;
}

interface State {
  protocolSupports: any[];
  protocolTransports: any[];
  organizationList: any[];
  configForm: any[];
  configName: string;
  classified: any[];
  classifiedData: any;
}

const Save: React.FC<Props> = props => {
  const initState: State = {
    protocolSupports: [],
    protocolTransports: [],
    organizationList: [],
    configName: '',
    configForm: [],
    classified: [],
    classifiedData: {},
  };

  const {getFieldDecorator} = props.form;
  // 消息协议
  const [protocolSupports, setProtocolSupports] = useState(initState.protocolSupports);
  // 消息协议
  const [organizationList, setOrganizationList] = useState(initState.organizationList);
  // 传输协议
  const [protocolTransports, setProtocolTransports] = useState(initState.protocolTransports);
  const [classified, setClassified] = useState(initState.classified);
  const [classifiedData, setClassifiedData] = useState(initState.classifiedData);
  const [categoryId, setCategoryId] = useState(initState.configName);

  const [photoUrl, setPhotoUrl] = useState(props.data?.photoUrl);
  const [classifiedVisible, setClassifiedVisible] = useState(false);

  const onMessageProtocolChange = (value: string) => {
    // 获取链接协议
    apis.deviceProdcut
      .protocolTransports(value)
      .then(e => {
        if (e.status === 200) {
          setProtocolTransports(e.result);
        }
      })
      .catch(() => {
      });
  };

  useEffect(() => {
    apis.deviceProdcut
      .protocolSupport()
      .then(e => {
        if (e.status === 200) {
          setProtocolSupports(e.result);
        }
      })
      .catch(() => {
      });

    apis.deviceProdcut.deviceCategoryTree()
      .then((response: any) => {
        if (response.status === 200) {
          setClassified(response.result);
        }
      })
      .catch(() => {
      });

    apis.deviceProdcut.queryOrganization()
      .then((res: any) => {
        if (res.status === 200) {
          let orgList: any = [];
          res.result.map((item: any) => {
            orgList.push({id: item.id, pId: item.parentId, value: item.id, title: item.name})
          });
          setOrganizationList(orgList);
        }
      }).catch(() => {
    });

    if (props.data && props.data.messageProtocol) {
      onMessageProtocolChange(props.data.messageProtocol);
    }
  }, []);

  const basicForm: FormItemConfig[] = [
    {
      label: '产品ID',
      key: 'id',
      styles: {
        lg: {span: 8},
        md: {span: 12},
        sm: {span: 24},
      },
      options: {
        initialValue: props.data?.id,
        rules: [{required: true, message: '请输入产品ID'}],
      },
      component: (
        <Input
          placeholder="请输入产品ID "
          disabled={!!props.data?.id}
        />
      ),
    },
    {
      label: '产品名称',
      key: 'name',
      options: {
        rules: [{required: true, message: '请选择产品名称'}],
        initialValue: props.data?.name,
      },
      styles: {
        xl: {span: 8},
        lg: {span: 8},
        md: {span: 12},
        sm: {span: 24},
      },
      component: <Input style={{width: '100%'}} placeholder="请输入"/>,
    },
    {
      label: '所属品类',
      key: 'classified',
      options: {
        rules: [{required: true, message: '请选择所属品类'}],
        initialValue: categoryId,
      },
      styles: {
        xl: {span: 8},
        lg: {span: 8},
        md: {span: 12},
        sm: {span: 24},
      },
      component:
        <Cascader
          fieldNames={{label: 'name', value: 'id', children: 'children'}}
          options={classified}
          popupVisible={false}
          onClick={() => {
            setClassifiedVisible(true);
          }}
          placeholder="点击选择品类"/>,
    },
    {
      label: '所属机构',
      key: 'orgId',
      options: {
        initialValue: props.data?.orgId,
      },
      styles: {
        xl: {span: 8},
        lg: {span: 10},
        md: {span: 24},
        sm: {span: 24},
      },
      component: <TreeSelect
        allowClear treeDataSimpleMode showSearch
        placeholder="所属机构" treeData={organizationList}
        treeNodeFilterProp='title' searchPlaceholder='根据机构名称模糊查询'
      />,
    },
    {
      label: '消息协议',
      key: 'messageProtocol',
      options: {
        rules: [{required: true, message: '请选择消息协议'}],
        initialValue: props.data?.messageProtocol,
      },
      styles: {
        xl: {span: 8},
        lg: {span: 8},
        md: {span: 12},
        sm: {span: 24},
      },
      component: (
        <Select
          placeholder="请选择"
          onChange={(value: string) => {
            onMessageProtocolChange(value);
          }}
        >
          {protocolSupports.map(e => (
            <Select.Option value={e.id} key={e.id}>
              {e.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      label: '传输协议',
      key: 'transportProtocol',
      options: {
        rules: [{required: true, message: '请选择传输协议'}],
        initialValue: props.data?.transportProtocol,
      },
      styles: {
        xl: {span: 8},
        lg: {span: 10},
        md: {span: 24},
        sm: {span: 24},
      },
      component: (
        <Select placeholder="请选择">
          {protocolTransports.map(e => (
            <Select.Option value={e.id} key={e.id}>
              {e.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },

    {
      label: '设备类型',
      key: 'deviceType',
      options: {
        rules: [{required: true, message: '请选择设备类型'}],
        initialValue:
          typeof props.data?.deviceType === 'string'
            ? props.data?.deviceType
            : (props.data?.deviceType || {}).value,
      },
      styles: {
        lg: {span: 8},
        md: {span: 12},
        sm: {span: 24},
      },
      component: (
        <Radio.Group>
          <Radio value="device">直连设备</Radio>
          <Radio value="childrenDevice">网关子设备</Radio>
          <Radio value="gateway">网关设备</Radio>
        </Radio.Group>
      ),
    },
    {
      label: '描述',
      key: 'describe',
      styles: {
        xl: {span: 24},
        lg: {span: 24},
        md: {span: 24},
        sm: {span: 24},
      },
      options: {
        initialValue: props.data?.describe,
      },
      component: <Input.TextArea rows={4} placeholder="请输入描述"/>,
    },
  ];

  const saveData = () => {
    const {form} = props;
    form.validateFields((err, fileValue) => {
      if (err) return;
      if (!fileValue.orgId) {
        fileValue.orgId = '';
      }

      const protocol: Partial<ProtocolItem> =
        protocolSupports.find(i => i.id === fileValue.messageProtocol) || {};

      apis.deviceProdcut.saveDeviceProduct({
        state: 0,
        ...fileValue,
        photoUrl,
        protocolName: protocol.name,
        classifiedId: classifiedData.id,
        classifiedName: classifiedData.name
      })
        .then((response: any) => {
          if (response.status === 200) {
            message.success('保存成功');
            router.push(`/device/product/save/${response.result.id}`);
          }
        })
        .catch(() => {
        })
    });
  };

  const uploadProps: UploadProps = {
    action: '/jetlinks/file/static',
    headers: {
      'X-Access-Token': getAccessToken(),
    },
    showUploadList: false,
    onChange(info) {
      if (info.file.status === 'done') {
        setPhotoUrl(info.file.response.result);
        message.success('上传成功');
      }
    },
  };

  return (
    <PageHeaderWrapper>
      <Card title="基本信息" bordered={false}>
        <div className={styles.right}>
          <Spin spinning={false}>
            <div className={styles.baseView}>
              <div className={styles.left}>
                <Form labelCol={{span: 5}} wrapperCol={{span: 16}}>
                  <Row gutter={16}>
                    {basicForm.map(item => (
                      <Col key={item.key}>
                        <Form.Item label={item.label}>
                          {getFieldDecorator(item.key, item.options)(item.component)}
                        </Form.Item>
                      </Col>
                    ))}
                  </Row>
                </Form>
              </div>
              <div className={styles.right}>
                <>
                  <div className={styles.avatar_title}>
                    图标
                  </div>
                  <div className={styles.avatar}>
                    <Avatar size={144} src={photoUrl || props.data?.photoUrl || productImg}/>
                  </div>
                  <Upload {...uploadProps} showUploadList={false}>
                    <div className={styles.button_view}>
                      <Button>
                        <UploadOutlined/>
                        更换图片
                      </Button>
                    </div>
                  </Upload>
                </>
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                height: 32,
                lineHeight: 4,
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                paddingRight: 16,
                background: '#fff',
                textAlign: 'right',
              }}
            >
              <Button
                onClick={() => {
                  props.close();
                }}
                style={{marginRight: 8}}
              >
                关闭
              </Button>
              <Button
                onClick={() => {
                  saveData();
                }}
                type="primary"
              >
                保存
              </Button>
            </div>
          </Spin>
        </div>
      </Card>
      {classifiedVisible && <Classified choice={(item: any) => {
        /*console.log(item);
        console.log(item.split('|').filter(function (s: string) {
          return s && s.trim();
        }));*/
        setCategoryId(item.categoryId);
        setClassifiedData(item);
        setClassifiedVisible(false);
      }} close={() => {
        setClassifiedVisible(false);
      }} data={classifiedData}/>}
    </PageHeaderWrapper>
  );
};

export default Form.create<Props>()(Save);
