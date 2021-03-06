import { UseQueryResult } from 'react-query'
import { useHistory, useParams } from 'react-router'

import Badge from '../../components/Badge'
import IconButton from '../../components/IconButton'
import ArrowBack from '../../components/ArrowBack'
import Image from '../../components/Image'
import Spinner from '../../components/Spinner'

import { Pokemon as PokemonType } from '../../types/pokemon'

import { ReactComponent as BookmarkIcon } from './bookmark.svg'
import { ReactComponent as BookmarkedIcon } from './bookmarked.svg'
import { statLabels } from './labels'
import { usePokemon } from '../../hooks/usePokemons'
import useBookmark from '../../hooks/useBookmark'

import {
  Attribute,
  AttributeList,
  BookmarkContainer,
  Container,
  Header,
  HeaderContent,
  Id,
  Main,
  Name,
  PictureContainer,
  TypesList,
  SpinnerStyle,
} from './styles'

type Props = {
  pokemonId: number,
  onBackClick: () => void,
  hooks: {
    usePokemon: (id: number) => Partial<UseQueryResult<PokemonType>>,
  },
}

export const Pokemon = (
  { pokemonId, onBackClick, hooks }: Props
): JSX.Element => {
  const { isLoading, data } = hooks.usePokemon(pokemonId)
  const { get, add, remove } = useBookmark()

  const bookmarked = !!get(pokemonId)

  const BookmarkStateIcon = bookmarked ? BookmarkedIcon : BookmarkIcon

  const handleBookmark = () => {
    const newBookmarkState = !bookmarked

    if (newBookmarkState) {
      add(pokemonId)
    } else {
      remove(pokemonId)
    }
  }

  return (
    <Container>
      <Header type={data?.types[0].type.name}>
        <ArrowBack onClick={onBackClick} />
        {!isLoading && (
          <BookmarkContainer>
            <IconButton
              ariaLabel="Bookmark Pokémon"
              onClick={handleBookmark}
              icon={<BookmarkStateIcon width={32} height={32} />}
            />
          </BookmarkContainer>
        )}
        <HeaderContent>
          {isLoading ? (
            <SpinnerStyle>
              <Spinner r={50} />
            </SpinnerStyle>
          ) : (
            <>
              <Id>#{String(data && data.id).padStart(3, '0')}</Id>
              <Name>{data && data.name}</Name>
              <PictureContainer>
                <Image
                  alt={data?.name || ''}
                  width={150}
                  height={150}
                  src={data?.picture || ''}
                />
              </PictureContainer>
            </>
          )}
        </HeaderContent>
      </Header>
      <Main>
        <TypesList>
          {data && data.types.map(({ slot, type }) => (
            <Badge
              key={slot}
              aria-label={type.name}
              size="xl"
              color={type.name}
            >{type.name}</Badge>
          ))}
        </TypesList>
        <AttributeList>
          {data && data.stats.map(({ value, stat }) => (
            <Attribute key={stat.name} aria-label={stat.name}>
              <span>{statLabels[stat.name]}</span>
              <span>{value}</span>
            </Attribute>
          ))}
        </AttributeList>
      </Main>
    </Container>
  )
}

const PokemonPage = (): JSX.Element | null => {
  const { id } = useParams<{ id: string }>()
  const { replace } = useHistory()

  const numberId = Number.parseInt(id, 10)

  if (Number.isNaN(numberId)) {
    replace('/pokemon')
    return null
  }

  return (
    <Pokemon
      pokemonId={numberId}
      onBackClick={() => replace('/pokemon')}
      hooks={{ usePokemon }}
    />
  )
}

export default PokemonPage
