<?php

namespace {{= it.ns }};

use yii\db\Migration;

/**
 * Handles the creation of table `{{= it.struct.table }}`.
 */
class {{= it.struct.name }} extends Migration
{
    private $tableName = '{*%{{= it.struct.table }}*}';

    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->createTable($this->tableName, [
		{{~ it.struct.rows :value}}
			{{? value.colum == 'id' && value.type == 'integer()' }}
				'id' => $this->primaryKey(),
			{{?? ~value.type.indexOf(')') }}
				'{{= value.colum }}' => $this->{{= value.type }},
			{{??}}
				'{{= value.colum }}' => '{{= value.type }}',
			{{?}}
		{{~}}
        ]);
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        echo "Table $this->tableName cannot be reverted.\n;";
    }
}
